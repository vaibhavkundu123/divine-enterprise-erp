import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Check, Download, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { ExchangeEditModal } from '../modals/EditModals';
import { formatCurrency } from '../utils/formatters';

export default function ExchangesView() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingExch, setEditingExch] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Exchange form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [origStyle, setOrigStyle] = useState('');
  const [exchStyle, setExchStyle] = useState('');
  const [qty, setQty] = useState(1);
  const [stdPrice, setStdPrice] = useState('');
  const [fee, setFee] = useState(175);
  const [primaryReason, setPrimaryReason] = useState('Size/Fit Swap');
  const [secondaryReason, setSecondaryReason] = useState('');
  const [reverseAwb, setReverseAwb] = useState('');
  const [salesList, setSalesList] = useState([]);

  const loadData = () => {
    setLoading(true);
    api.getExchanges()
      .then((data) => setExchanges(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    api.getSales()
      .then((data) => {
        if (Array.isArray(data)) setSalesList(data.slice(-35).reverse());
      })
      .catch((err) => console.error('Failed to load sales for exchange auto-fill:', err));
  }, []);

  const handleReceive = async (id) => {
    try {
      await api.receiveExchange(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRestock = async (id) => {
    try {
      await api.restockExchange(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDamage = async (id) => {
    if (!window.confirm('Write off this exchange return as damaged / loss?')) return;
    try {
      await api.damageExchange(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBulkRestock = async () => {
    try {
      const res = await api.bulkRestockExchanges();
      alert(res.message);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete exchange record?')) return;
    try {
      await api.deleteExchange(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createExchange({
        date,
        original_style: origStyle.trim(),
        exchanged_style: exchStyle.trim(),
        quantity: parseInt(qty, 10),
        standard_price: parseFloat(stdPrice),
        reverse_fee: parseFloat(fee || 0),
        primary_reason: primaryReason,
        secondary_reason: secondaryReason || null,
        reverse_awb: reverseAwb || null,
      });
      setShowAddModal(false);
      setOrigStyle('');
      setExchStyle('');
      setQty(1);
      setStdPrice('');
      setFee(175);
      setPrimaryReason('Size/Fit Swap');
      setSecondaryReason('');
      setReverseAwb('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const holdingCount = exchanges.filter((e) => e.return_status === 'Intake' || e.return_status === 'Received').length;

  const filtered = exchanges.filter((e) => {
    const matchSearch =
      e.original_style.toLowerCase().includes(search.toLowerCase()) ||
      e.exchanged_style.toLowerCase().includes(search.toLowerCase()) ||
      (e.primary_reason && e.primary_reason.toLowerCase().includes(search.toLowerCase())) ||
      (e.reverse_awb && e.reverse_awb.toLowerCase().includes(search.toLowerCase()));
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'Received'
        ? (e.return_status === 'Received' || e.return_status === 'Intake')
        : (statusFilter === 'In Transit'
            ? (e.return_status === 'In Transit' || e.return_status === 'Dispatched')
            : e.return_status.toLowerCase() === statusFilter.toLowerCase()));
    return matchSearch && matchStatus;
  });

  const getReturnStatusPill = (status) => {
    switch (status) {
      case 'In Transit':
      case 'Dispatched':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">In Transit</span>;
      case 'Received':
      case 'Intake':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 animate-pulse">Received (Dock)</span>;
      case 'Restocked':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Restocked</span>;
      case 'Damaged':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">Damaged (Loss)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  const handleExcelExport = () => {
    const formatted = filtered.map((e, i) => ({
      'Sl. No.': i + 1,
      Date: e.date,
      'Returned SKU': e.original_style,
      'Dispatched SKU': e.exchanged_style,
      Quantity: e.quantity,
      'Standard Price ($)': e.standard_price,
      'Reverse Fee ($)': e.reverse_fee,
      'Net Settlement ($)': e.net_settlement,
      'Primary Reason': e.primary_reason || '',
      'Secondary Reason': e.secondary_reason || '',
      'Reverse AWB': e.reverse_awb || '',
      'Return Status': e.return_status,
      'Date Received': e.received_date || '',
      'Date Restocked': e.restocked_date || '',
    }));
    exportToExcel(formatted, `Exchanges_${new Date().toISOString().split('T')[0]}.xlsx`, 'Exchanges');
  };

  const handleCsvExport = () => {
    exportToCSV(filtered, `exchanges_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="relative w-full sm:w-64">
            <label htmlFor="exchanges-search-input" className="sr-only">Search exchanges</label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              id="exchanges-search-input"
              name="exchanges_search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SKUs, AWB, Reason..."
              style={{ paddingLeft: '2.5rem' }}
              className="input-field text-xs h-9 bg-slate-900 border-slate-700"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
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
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {holdingCount > 0 && (
            <button
              onClick={handleBulkRestock}
              className="btn btn-success text-xs px-3.5 h-9"
              title="Restock all received exchange returns into active stock"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Bulk Restock Dock ({holdingCount})</span>
            </button>
          )}
          <button onClick={handleExcelExport} className="btn btn-outline text-xs px-3 h-9">
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button onClick={handleCsvExport} className="btn btn-outline text-xs px-3 h-9">
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary text-xs px-3.5 h-9">
            <Plus className="w-3.5 h-3.5" />
            <span>New Exchange</span>
          </button>
        </div>
      </div>

      {/* Exchanges Table */}
      <div className="glass-panel overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 text-center">Sl. No.</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Returned SKU</th>
                <th className="py-3 px-4">Dispatched SKU</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Standard Price</th>
                <th className="py-3 px-4 text-right">Reverse Fee</th>
                <th className="py-3 px-4 text-right">Net Settlement</th>
                <th className="py-3 px-4">Primary Reason</th>
                <th className="py-3 px-4">Reverse AWB</th>
                <th className="py-3 px-4 text-center">Return Status</th>
                <th className="py-3 px-4 text-center">Date Received</th>
                <th className="py-3 px-4 text-center">Date Restocked</th>
                <th className="py-3 px-4 text-center">Dock Operations</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="15" className="py-8 text-center text-slate-400">Loading exchanges...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="15" className="py-8 text-center text-slate-400">No exchange records found.</td>
                </tr>
              ) : (
                filtered.map((e, idx) => (
                  <tr key={e.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{e.date}</td>
                    <td className="py-3 px-4 font-bold text-amber-300 uppercase">{e.original_style}</td>
                    <td className="py-3 px-4 font-bold text-blue-400 uppercase">{e.exchanged_style}</td>
                    <td className="py-3 px-4 text-center font-semibold text-white">{e.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(e.standard_price)}</td>
                    <td className="py-3 px-4 text-right font-mono text-rose-300">{formatCurrency(e.reverse_fee)}</td>
                    <td className="py-3 px-4 text-right font-bold text-white font-mono">{formatCurrency(e.net_settlement)}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-[130px] truncate" title={e.primary_reason}>{e.primary_reason || '—'}</td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{e.reverse_awb || '—'}</td>
                    <td className="py-3 px-4 text-center">{getReturnStatusPill(e.return_status)}</td>
                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {e.received_date || '—'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px] text-emerald-400 whitespace-nowrap">
                      {e.restocked_date || '—'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {(e.return_status === 'In Transit' || e.return_status === 'Dispatched') && (
                        <button
                          onClick={() => handleReceive(e.id)}
                          className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30"
                        >
                          Mark Received
                        </button>
                      )}
                      {(e.return_status === 'Intake' || e.return_status === 'Received') && (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleRestock(e.id)}
                            className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30"
                          >
                            Restock
                          </button>
                          <button
                            onClick={() => handleDamage(e.id)}
                            className="px-2.5 py-1 rounded text-xs font-semibold bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30"
                          >
                            Damaged
                          </button>
                        </div>
                      )}
                      {e.return_status === 'Restocked' && (
                        <span className="text-[11px] text-emerald-400 font-mono">Restocked to Inventory</span>
                      )}
                      {e.return_status === 'Damaged' && (
                        <span className="text-[11px] text-rose-400 font-mono">Loss Written Off</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setEditingExch(e)} className="p-1 text-slate-400 hover:text-white" aria-label="Edit exchange">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(e.id)} className="p-1 text-slate-400 hover:text-rose-400" aria-label="Delete exchange">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filtered.length > 0 && (() => {
              const totalQty = filtered.reduce((a, e) => a + (e.quantity || 0), 0);
              const totalStdPrice = filtered.reduce((a, e) => a + (e.standard_price || 0), 0);
              const totalFee = filtered.reduce((a, e) => a + (e.reverse_fee || 0), 0);
              const totalNet = filtered.reduce((a, e) => a + (e.net_settlement || 0), 0);

              return (
                <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-bold text-white">
                  <tr>
                    <td className="py-3 px-3 text-center text-slate-400 text-xs">—</td>
                    <td className="py-3 px-4 text-slate-300 text-xs">{filtered.length} Swaps</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-center font-bold text-white text-xs">{totalQty}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300 text-xs">{formatCurrency(totalStdPrice)}</td>
                    <td className="py-3 px-4 text-right font-mono text-rose-400 text-xs">{formatCurrency(totalFee)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 text-xs">{formatCurrency(totalNet)}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">-</td>
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

      {/* Add Exchange Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 border border-slate-700 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-white text-base mb-4 pb-2 border-b border-slate-800">Record Item Exchange & Reverse Pickup</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label htmlFor="ex-sale-select" className="text-xs text-slate-300 block mb-1 font-semibold text-emerald-400">
                  ⚡ Fast Auto-Fill from Recorded Sale (Optional)
                </label>
                <select
                  id="ex-sale-select"
                  className="input-field text-xs mb-1"
                  onChange={(e) => {
                    const idx = e.target.value;
                    if (idx === '') return;
                    const s = salesList[parseInt(idx, 10)];
                    if (s) {
                      setOrigStyle(s.style_no || '');
                      setExchStyle(s.style_no || '');
                      const sQty = s.quantity_sold || 1;
                      setQty(sQty);
                      const unitP = s.unit_price || (s.total_revenue / sQty) || 0;
                      setStdPrice(Number(unitP).toFixed(2));
                      if (s.date) setDate(s.date);
                    }
                  }}
                >
                  <option value="">-- Or enter style details manually below --</option>
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
                  Selecting a past order automatically fills the returned style and standard replacement price.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="exch-date" className="text-xs text-slate-300 block mb-1">Exchange Date *</label>
                  <input id="exch-date" name="exch_date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label htmlFor="exch-qty" className="text-xs text-slate-300 block mb-1">Quantity *</label>
                  <input id="exch-qty" name="exch_qty" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} required className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="exch-orig-sku" className="text-xs text-slate-300 block mb-1">Original Style (Returned Item) *</label>
                  <input id="exch-orig-sku" name="exch_orig_sku" type="text" value={origStyle} onChange={(e) => setOrigStyle(e.target.value)} placeholder="e.g. DE26004R" required className="input-field uppercase" />
                </div>
                <div>
                  <label htmlFor="exch-new-sku" className="text-xs text-slate-300 block mb-1">Exchanged Style (New Item Ordered) *</label>
                  <input id="exch-new-sku" name="exch_new_sku" type="text" value={exchStyle} onChange={(e) => setExchStyle(e.target.value)} placeholder="e.g. DE26004R" required className="input-field uppercase" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="exch-std-price" className="text-xs text-slate-300 block mb-1">Standard Selling Price ($) *</label>
                  <input id="exch-std-price" name="exch_std_price" type="number" step="0.01" value={stdPrice} onChange={(e) => setStdPrice(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label htmlFor="exch-fee" className="text-xs text-slate-300 block mb-1">Reverse Courier Shipping Fee ($)</label>
                  <input id="exch-fee" name="exch_fee" type="number" step="0.01" value={fee} onChange={(e) => setFee(e.target.value)} className="input-field" />
                </div>
              </div>
              <div>
                <label htmlFor="exch-primary-reason" className="text-xs text-slate-300 block mb-1">Primary Return Reason *</label>
                <select id="exch-primary-reason" name="exch_primary_reason" value={primaryReason} onChange={(e) => setPrimaryReason(e.target.value)} className="input-field">
                  <option value="Size/Fit Swap">Size/Fit Swap</option>
                  <option value="Size Too Small / Fit Issue">Size Too Small / Fit Issue</option>
                  <option value="Size Too Large / Fit Issue">Size Too Large / Fit Issue</option>
                  <option value="Color Preference">Color Preference</option>
                  <option value="Style Change">Style Change</option>
                  <option value="Fabric Quality Issue">Fabric Quality Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="exch-secondary-reason" className="text-xs text-slate-300 block mb-1">Secondary Return Reason</label>
                <input
                  id="exch-secondary-reason"
                  name="exch_secondary_reason"
                  type="text"
                  value={secondaryReason}
                  onChange={(e) => setSecondaryReason(e.target.value)}
                  placeholder="e.g. Customer wanted next size up"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="exch-awb" className="text-xs text-slate-300 block mb-1">Reverse Courier & AWB #</label>
                <input
                  id="exch-awb"
                  name="exch_awb"
                  type="text"
                  value={reverseAwb}
                  onChange={(e) => setReverseAwb(e.target.value)}
                  placeholder="e.g. DELHIV-EX-991280"
                  className="input-field"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary text-xs">Confirm Exchange</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingExch && (
        <ExchangeEditModal
          exchange={editingExch}
          isOpen={true}
          onClose={() => setEditingExch(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
