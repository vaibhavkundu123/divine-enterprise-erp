import React, { useState, useEffect } from 'react';
import { RotateCcw, Check, AlertTriangle, Download, Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';
import { api } from '../services/api';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { RTOEditModal } from '../modals/EditModals';
import { formatCurrency } from '../utils/formatters';
import useTableControls from '../utils/useTableControls';
import SortableHeader from '../components/SortableHeader';

const COLUMNS = [
  { key: 'date', sortable: true, filterable: true },
  { key: 'style_no', sortable: true, filterable: true },
  { key: 'quantity', sortable: true, filterable: true },
  { key: 'sale_price', sortable: true, filterable: true },
  { key: 'courier_fee', sortable: true, filterable: true },
  { key: 'tracking_no', sortable: true, filterable: true, getValue: (r) => r.tracking_no || '—' },
  { key: 'status', sortable: true, filterable: true },
  { key: 'received_date', sortable: true, filterable: true, getValue: (r) => r.received_date || '—' },
  { key: 'restocked_date', sortable: true, filterable: true, getValue: (r) => r.restocked_date || '—' },
];

export default function RTOView() {
  const [rtos, setRtos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingRTO, setEditingRTO] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New RTO state
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStyle, setNewStyle] = useState('');
  const [newQty, setNewQty] = useState(1);
  const [newPrice, setNewPrice] = useState('');
  const [newFee, setNewFee] = useState(0);
  const [newTracking, setNewTracking] = useState('');
  const [salesList, setSalesList] = useState([]);

  const loadRTO = () => {
    setLoading(true);
    api.getRTO()
      .then((data) => setRtos(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRTO();
    api.getSales()
      .then((data) => {
        if (Array.isArray(data)) setSalesList(data.slice(-35).reverse());
      })
      .catch((err) => console.error('Failed to load sales list for RTO auto-fill:', err));
  }, []);

  const handleReceive = async (id) => {
    try {
      await api.receiveRTO(id);
      loadRTO();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRestock = async (id) => {
    try {
      await api.restockRTO(id);
      loadRTO();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDamage = async (id) => {
    if (!window.confirm('Write off this RTO parcel as damaged loss?')) return;
    try {
      await api.damageRTO(id);
      loadRTO();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBulkRestock = async () => {
    try {
      const res = await api.bulkRestockRTO();
      alert(res.message);
      loadRTO();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this RTO record?')) return;
    try {
      await api.deleteRTO(id);
      loadRTO();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createRTO({
        date: newDate,
        style_no: newStyle.trim(),
        quantity: parseInt(newQty, 10),
        sale_price: parseFloat(newPrice),
        courier_fee: parseFloat(newFee || 0),
        tracking_no: newTracking,
      });
      setShowAddModal(false);
      loadRTO();
    } catch (err) {
      alert(err.message);
    }
  };

  const holdingCount = rtos.filter((r) => r.status === 'Received').length;

  // Existing search + status filter
  const searchFiltered = rtos.filter((r) => {
    const matchSearch =
      r.style_no.toLowerCase().includes(search.toLowerCase()) ||
      r.rto_id.toLowerCase().includes(search.toLowerCase()) ||
      (r.tracking_no && r.tracking_no.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'ALL' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  // Column sort/filter
  const {
    sortConfig, columnFilters, requestSort, clearSort, getUniqueValues, getValueCounts,
    isFilterActive, toggleFilterValue, selectOnlyFilter, selectAllFilter, deselectAllFilter,
    clearFilter, clearAllFilters, activeFilterCount, processedData,
  } = useTableControls({ data: searchFiltered, columns: COLUMNS });

  const filtered = processedData;

  const getStatusPill = (status) => {
    switch (status) {
      case 'In Transit':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">In Transit</span>;
      case 'Received':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 animate-pulse">Received (Dock)</span>;
      case 'Restocked':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Restocked</span>;
      case 'Damaged':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">Damaged (Loss)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  const handleExcelExport = () => {
    const formatted = filtered.map((r, idx) => ({
      'Sl. No.': idx + 1,
      Date: r.date,
      'Style SKU': r.style_no,
      Quantity: r.quantity,
      'Sale Price ($)': r.sale_price,
      'Courier Fee ($)': r.courier_fee,
      Status: r.status,
      'Date Received': r.received_date || '',
      'Date Restocked': r.restocked_date || '',
      'Tracking AWB': r.tracking_no || 'N/A',
      'Recovered COGS ($)': r.recovered_cogs,
      'Damaged Loss ($)': r.damaged_loss,
    }));
    exportToExcel(formatted, `RTO_Pipeline_${new Date().toISOString().split('T')[0]}.xlsx`, 'RTO Returns');
  };

  const handleCsvExport = () => {
    exportToCSV(filtered, `rto_pipeline_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const sharedHeaderProps = {
    sortConfig, columnFilters, onSort: requestSort, clearSort, getUniqueValues, getValueCounts,
    isFilterActive, onToggleFilter: toggleFilterValue, onSelectOnlyFilter: selectOnlyFilter,
    onSelectAll: selectAllFilter, onDeselectAll: deselectAllFilter, onClearFilter: clearFilter,
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Actions HUD */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-3" data-tour="rto-hud">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="relative w-full sm:w-64" data-tour="rto-search">
            <label htmlFor="rto-search-input" className="sr-only">Search RTO parcels</label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              id="rto-search-input"
              name="rto_search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search RTO, SKU, AWB..."
              style={{ paddingLeft: '2.5rem' }}
              className="input-field text-xs h-9 bg-slate-900 border-slate-700"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none" data-tour="rto-status-filter">
            {['ALL', 'In Transit', 'Received', 'Restocked', 'Damaged'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-2.5 py-1 text-xs rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Clear all active column filters"
            >
              <Filter className="w-3 h-3" />
              <span>Filters ({activeFilterCount})</span>
              <span className="text-blue-400 font-bold ml-0.5">✕</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {holdingCount > 0 && (
            <button
              onClick={handleBulkRestock}
              className="btn btn-success text-xs px-3.5 h-9"
              title="Restock all inspected units back into warehouse inventory"
              data-tour="rto-bulk-restock"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Bulk Restock Dock ({holdingCount})</span>
            </button>
          )}

          <div className="flex items-center gap-2" data-tour="rto-export">
            <button onClick={handleExcelExport} className="btn btn-outline text-xs px-3 h-9">
              <Download className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
            <button onClick={handleCsvExport} className="btn btn-outline text-xs px-3 h-9">
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary text-xs px-3.5 h-9" data-tour="rto-add-btn">
            <Plus className="w-3.5 h-3.5" />
            <span>Log RTO</span>
          </button>
        </div>
      </div>

      {/* RTO Pipeline Table */}
      <div className="glass-panel overflow-hidden border border-slate-800" data-tour="rto-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 text-center">Sl. No.</th>
                <SortableHeader label="Initiated Date" columnKey="date" sortable {...sharedHeaderProps} />
                <SortableHeader label="Style SKU" columnKey="style_no" sortable filterable {...sharedHeaderProps}
                  activeFilterValues={columnFilters['style_no']}
                  extraProps={{ 'data-tour': 'rto-col-sku' }}
                />
                <SortableHeader label="Qty" columnKey="quantity" sortable align="center" {...sharedHeaderProps} />
                <SortableHeader label="Sale Price" columnKey="sale_price" sortable align="right" {...sharedHeaderProps} />
                <SortableHeader label="Courier Fee" columnKey="courier_fee" sortable align="right" {...sharedHeaderProps} />
                <SortableHeader label="Carrier Tracking" columnKey="tracking_no" sortable {...sharedHeaderProps}
                  extraProps={{ 'data-tour': 'rto-col-tracking' }}
                />
                <SortableHeader label="Status" columnKey="status" sortable filterable align="center" {...sharedHeaderProps}
                  activeFilterValues={columnFilters['status']}
                  extraProps={{ 'data-tour': 'rto-col-status' }}
                />
                <SortableHeader label="Date Received" columnKey="received_date" sortable align="center" {...sharedHeaderProps} />
                <SortableHeader label="Date Restocked" columnKey="restocked_date" sortable align="center" {...sharedHeaderProps} />
                <th className="py-3 px-4 text-center" data-tour="rto-col-dock">Dock Operations</th>
                <th className="py-3 px-4 text-center" data-tour="rto-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="12" className="py-8 text-center text-slate-400">Loading RTO pipeline...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="12" className="py-8 text-center text-slate-400">No RTO records matching filter.</td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{r.date}</td>
                    <td className="py-3 px-4 font-bold text-white uppercase">{r.style_no}</td>
                    <td className="py-3 px-4 text-center font-semibold text-white">{r.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(r.sale_price)}</td>
                    <td className="py-3 px-4 text-right font-mono text-rose-300">{formatCurrency(r.courier_fee)}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{r.tracking_no || '—'}</td>
                    <td className="py-3 px-4 text-center">{getStatusPill(r.status)}</td>
                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {r.received_date || '—'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px] text-emerald-400 whitespace-nowrap">
                      {r.restocked_date || '—'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {r.status === 'In Transit' && (
                        <button
                          onClick={() => handleReceive(r.id)}
                          className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30"
                        >
                          Mark Received
                        </button>
                      )}
                      {r.status === 'Received' && (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleRestock(r.id)}
                            className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30"
                          >
                            Restock
                          </button>
                          <button
                            onClick={() => handleDamage(r.id)}
                            className="px-2.5 py-1 rounded text-xs font-semibold bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30"
                          >
                            Damaged
                          </button>
                        </div>
                      )}
                      {r.status === 'Restocked' && (
                        <span className="text-[11px] text-emerald-400 font-mono">Restocked to Inventory</span>
                      )}
                      {r.status === 'Damaged' && (
                        <span className="text-[11px] text-rose-400 font-mono">Loss Written Off</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setEditingRTO(r)} className="p-1 text-slate-400 hover:text-white" aria-label="Edit RTO">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="p-1 text-slate-400 hover:text-rose-400" aria-label="Delete RTO">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filtered.length > 0 && (() => {
              const totalQty = filtered.reduce((a, r) => a + (r.quantity || 0), 0);
              const totalSalePrice = filtered.reduce((a, r) => a + (r.sale_price || 0), 0);
              const totalFee = filtered.reduce((a, r) => a + (r.courier_fee || 0), 0);

              return (
                <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-bold text-white">
                  <tr>
                    <td className="py-3 px-3 text-center text-slate-400 text-xs">—</td>
                    <td className="py-3 px-4 text-slate-300 text-xs">{filtered.length} Parcels</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-center font-bold text-white text-xs">{totalQty}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-100 font-mono text-xs">{formatCurrency(totalSalePrice)}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-400 font-mono text-xs">{formatCurrency(totalFee)}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                  </tr>
                </tfoot>
              );
            })()}
          </table>
        </div>
      </div>

      {/* Add RTO Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 border border-slate-700">
            <h3 className="font-bold text-white text-base mb-4 pb-2 border-b border-slate-800">Log In-Transit RTO Parcel</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label htmlFor="rto-sale-select" className="text-xs text-slate-300 block mb-1 font-semibold text-blue-400">
                  ⚡ Fast Auto-Fill from Recorded Sale (Optional)
                </label>
                <select
                  id="rto-sale-select"
                  className="input-field text-xs mb-1"
                  onChange={(e) => {
                    const idx = e.target.value;
                    if (idx === '') return;
                    const s = salesList[parseInt(idx, 10)];
                    if (s) {
                      setNewStyle(s.style_no || '');
                      setNewQty(s.quantity_sold || 1);
                      const unitP = s.unit_price || (s.total_revenue / (s.quantity_sold || 1)) || 0;
                      setNewPrice(unitP.toFixed(2));
                      if (s.date) setNewDate(s.date);
                    }
                  }}
                >
                  <option value="">-- Or type style manually below --</option>
                  {salesList.map((s, idx) => {
                    const uPrice = s.unit_price || (s.total_revenue / (s.quantity_sold || 1)) || 0;
                    return (
                      <option key={idx} value={idx}>
                        {s.date} • {s.style_no} ({s.quantity_sold} units @ ${Number(uPrice).toFixed(2)} = ${Number(s.total_revenue).toFixed(2)})
                      </option>
                    );
                  })}
                </select>
                <span className="text-[11px] text-slate-400 block">
                  Selecting a sale automatically fills in the style, quantity, and unit price.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="new-rto-date" className="text-xs text-slate-300 block mb-1">Date</label>
                  <input id="new-rto-date" name="rto_date" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label htmlFor="new-rto-qty" className="text-xs text-slate-300 block mb-1">Quantity</label>
                  <input id="new-rto-qty" name="rto_qty" type="number" min="1" value={newQty} onChange={(e) => setNewQty(e.target.value)} required className="input-field" />
                </div>
              </div>
              <div>
                <label htmlFor="new-rto-sku" className="text-xs text-slate-300 block mb-1">Style SKU</label>
                <input id="new-rto-sku" name="rto_sku" type="text" value={newStyle} onChange={(e) => setNewStyle(e.target.value)} placeholder="e.g. DE26001G" required className="input-field uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="new-rto-price" className="text-xs text-slate-300 block mb-1">Sale Price ($)</label>
                  <input id="new-rto-price" name="rto_price" type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label htmlFor="new-rto-fee" className="text-xs text-slate-300 block mb-1">Courier Fee ($)</label>
                  <input id="new-rto-fee" name="rto_fee" type="number" step="0.01" value={newFee} onChange={(e) => setNewFee(e.target.value)} className="input-field" />
                </div>
              </div>
              <div>
                <label htmlFor="new-rto-tracking" className="text-xs text-slate-300 block mb-1">Carrier Tracking AWB</label>
                <input id="new-rto-tracking" name="rto_tracking" type="text" value={newTracking} onChange={(e) => setNewTracking(e.target.value)} placeholder="e.g. Delhivery AWB-1490711" className="input-field" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary text-xs">Save RTO Parcel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingRTO && (
        <RTOEditModal
          rto={editingRTO}
          isOpen={true}
          onClose={() => setEditingRTO(null)}
          onSuccess={loadRTO}
        />
      )}
    </div>
  );
}
