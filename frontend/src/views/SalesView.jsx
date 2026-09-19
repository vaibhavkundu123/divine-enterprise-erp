import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Download, Edit2, Trash2, Filter } from 'lucide-react';
import { api } from '../services/api';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { SalesEditModal } from '../modals/EditModals';
import { formatCurrency } from '../utils/formatters';
import useTableControls from '../utils/useTableControls';
import SortableHeader from '../components/SortableHeader';

const COLUMNS = [
  { key: 'sl_no', sortable: true, filterable: true },
  { key: 'date', sortable: true, filterable: true },
  { key: 'style_no', sortable: true, filterable: true },
  { key: 'quantity_sold', sortable: true, filterable: true },
  { key: 'selling_price', sortable: true, filterable: true },
  { key: 'total_revenue', sortable: true, filterable: true },
  { key: 'cogs', sortable: true, filterable: true },
  { key: 'profit', sortable: true, filterable: true },
  { key: 'profit_margin', sortable: true, filterable: true, getValue: (r) => (r.profit_margin * 100).toFixed(1) + '%' },
  { key: 'reference', sortable: true, filterable: true, getValue: (r) => r.reference || 'Sale' },
];

export default function SalesView({ onRecordSaleClick, refreshTrigger }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  const [newSaleId, setNewSaleId] = useState(null);

  const loadSales = () => {
    setLoading(true);
    return api.getSales()
      .then((data) => {
        setSales(data);
        return data;
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // Reload when parent triggers a refresh (e.g. from GlobalRecordSaleModal)
  useEffect(() => {
    loadSales();
  }, [refreshTrigger]);

  // Global event listener for sales created anywhere across the app
  useEffect(() => {
    const handleSaleCreated = (event) => {
      const created = event.detail;
      if (created?.id) {
        setNewSaleId(created.id);
        setTimeout(() => setNewSaleId(null), 6000);
      }
      loadSales();
    };

    window.addEventListener('divine-sale-created', handleSaleCreated);
    return () => window.removeEventListener('divine-sale-created', handleSaleCreated);
  }, []);

  // Smooth scroll to newly created sale
  useEffect(() => {
    if (newSaleId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`sale-row-${newSaleId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [newSaleId, sales]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sales order and restore units back to inventory?')) return;
    try {
      await api.deleteSale(id);
      loadSales();
    } catch (err) {
      alert(err.message);
    }
  };

  // Text search filter (existing behavior)
  const searchFiltered = sales.filter((s) =>
    s.style_no.toLowerCase().includes(search.toLowerCase()) ||
    s.date.includes(search) ||
    (s.reference && s.reference.toLowerCase().includes(search.toLowerCase()))
  );

  // Column-level sort & filter
  const {
    sortConfig, columnFilters, requestSort, clearSort, getUniqueValues, getValueCounts,
    isFilterActive, toggleFilterValue, selectOnlyFilter, selectAllFilter, deselectAllFilter,
    clearFilter, clearAllFilters, activeFilterCount, processedData,
  } = useTableControls({ data: searchFiltered, columns: COLUMNS });

  const filtered = processedData;

  const handleExcelExport = () => {
    const formatted = filtered.map((s) => ({
      'Sl No.': s.sl_no,
      Date: s.date,
      'Style No.': s.style_no,
      'Quantity Sold': s.quantity_sold,
      'Selling Price ($)': s.selling_price,
      'Total Revenue ($)': s.total_revenue,
      'Cost of Goods Sold ($)': s.cogs,
      'Profit ($)': s.profit,
      'Profit Margin (%)': (s.profit_margin * 100).toFixed(2) + '%',
      Reference: s.reference || 'Sale',
    }));
    exportToExcel(formatted, `Sales_Orders_${new Date().toISOString().split('T')[0]}.xlsx`, 'Sales');
  };

  const handleCsvExport = () => {
    exportToCSV(filtered, `sales_orders_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Shared props for SortableHeader
  const sharedHeaderProps = {
    sortConfig, columnFilters, onSort: requestSort, clearSort, getUniqueValues, getValueCounts,
    isFilterActive, onToggleFilter: toggleFilterValue, onSelectOnlyFilter: selectOnlyFilter,
    onSelectAll: selectAllFilter, onDeselectAll: deselectAllFilter, onClearFilter: clearFilter,
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="relative w-full sm:w-72" data-tour="sales-search">
            <label htmlFor="sales-search-input" className="sr-only">Search sales orders</label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              id="sales-search-input"
              name="sales_search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SKU, Date, Channel..."
              style={{ paddingLeft: '2.5rem' }}
              className="input-field text-xs h-9 bg-slate-900 border-slate-700"
            />
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

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2" data-tour="sales-export">
            <button onClick={handleExcelExport} className="btn btn-outline text-xs px-3 h-9" title="Export to Excel">
              <Download className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
            <button onClick={handleCsvExport} className="btn btn-outline text-xs px-3 h-9" title="Export to CSV">
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
          <button
            onClick={onRecordSaleClick}
            className="btn btn-primary text-xs px-3.5 h-9"
            data-tour="sales-new-btn"
            title="Fast Record Sale (Alt+S)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sale</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel overflow-hidden border border-slate-800" data-tour="sales-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <SortableHeader label="#" columnKey="sl_no" sortable {...sharedHeaderProps} />
                <SortableHeader label="Date" columnKey="date" sortable {...sharedHeaderProps} />
                <SortableHeader label="Style SKU" columnKey="style_no" sortable filterable {...sharedHeaderProps}
                  activeFilterValues={columnFilters['style_no']}
                  extraProps={{ 'data-tour': 'sales-col-sku' }}
                />
                <SortableHeader label="Qty" columnKey="quantity_sold" sortable align="center" {...sharedHeaderProps} />
                <SortableHeader label="Selling Price" columnKey="selling_price" sortable align="right" {...sharedHeaderProps} />
                <SortableHeader label="Total Revenue" columnKey="total_revenue" sortable align="right" {...sharedHeaderProps}
                  extraProps={{ 'data-tour': 'sales-col-revenue' }}
                />
                <SortableHeader label="COGS" columnKey="cogs" sortable align="right" {...sharedHeaderProps}
                  extraProps={{ 'data-tour': 'sales-col-cogs' }}
                />
                <SortableHeader label="Gross Profit" columnKey="profit" sortable align="right" {...sharedHeaderProps}
                  extraProps={{ 'data-tour': 'sales-col-profit' }}
                />
                <SortableHeader label="Margin %" columnKey="profit_margin" sortable align="right" {...sharedHeaderProps}
                  extraProps={{ 'data-tour': 'sales-col-margin' }}
                />
                <SortableHeader label="Reference" columnKey="reference" sortable filterable {...sharedHeaderProps}
                  activeFilterValues={columnFilters['reference']}
                  extraProps={{ 'data-tour': 'sales-col-ref' }}
                />
                <th className="py-3 px-4 text-center" data-tour="sales-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="11" className="py-8 text-center text-slate-400">Loading sales records...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-8 text-center text-slate-400">No sales records found.</td>
                </tr>
              ) : (
                filtered.map((s, idx) => {
                  const marginPct = (s.profit_margin * 100).toFixed(1);
                  const isNew = s.id === newSaleId;
                  return (
                    <tr
                      key={s.id}
                      id={`sale-row-${s.id}`}
                      className={`transition-all duration-700 ${
                        isNew
                          ? 'bg-emerald-500/20 border-l-4 border-emerald-400 font-medium'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-slate-400">{s.sl_no}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{s.date}</td>
                      <td className="py-3 px-4 font-bold text-white uppercase">{s.style_no}</td>
                      <td className="py-3 px-4 text-center font-semibold text-white">{s.quantity_sold}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(s.selling_price)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-white">{formatCurrency(s.total_revenue)}</td>
                      <td
                        data-tour={idx === 0 ? "sales-sample-cogs" : undefined}
                        className="py-3 px-4 text-right text-rose-300 font-mono"
                      >
                        {formatCurrency(s.cogs)}
                      </td>
                      <td
                        data-tour={idx === 0 ? "sales-sample-profit" : undefined}
                        className={`py-3 px-4 text-right font-bold ${s.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                      >
                        {formatCurrency(s.profit)}
                      </td>
                      <td
                        data-tour={idx === 0 ? "sales-sample-margin" : undefined}
                        className="py-3 px-4 text-right"
                      >
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          s.profit >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {marginPct}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{s.reference || 'Sale'}</td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingOrder(s)}
                            className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Order"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Delete Order (Restores Stock)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filtered.length > 0 && (() => {
              const totalQty = filtered.reduce((acc, s) => acc + (s.quantity_sold || 0), 0);
              const totalRev = filtered.reduce((acc, s) => acc + (s.total_revenue || 0), 0);
              const totalCogs = filtered.reduce((acc, s) => acc + (s.cogs || 0), 0);
              const totalProf = filtered.reduce((acc, s) => acc + (s.profit || 0), 0);
              const blMargin = totalRev > 0 ? ((totalProf / totalRev) * 100).toFixed(1) : '0.0';

              return (
                <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-bold text-white">
                  <tr>
                    <td className="py-3 px-4 font-mono text-xs text-blue-400">TOTAL</td>
                    <td className="py-3 px-4 text-slate-300 text-xs">{filtered.length} Orders</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-center font-bold text-white text-xs">{totalQty}</td>
                    <td className="py-3 px-4 text-right text-slate-400">-</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400 text-xs">{formatCurrency(totalRev)}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-400 text-xs">{formatCurrency(totalCogs)}</td>
                    <td className={`py-3 px-4 text-right font-bold text-xs ${totalProf >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatCurrency(totalProf)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        totalProf >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {blMargin}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-center text-slate-400">-</td>
                  </tr>
                </tfoot>
              );
            })()}
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <SalesEditModal
          order={editingOrder}
          isOpen={true}
          onClose={() => setEditingOrder(null)}
          onSuccess={() => {
            setEditingOrder(null);
            loadSales();
          }}
        />
      )}
    </div>
  );
}
