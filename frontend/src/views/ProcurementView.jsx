import React, { useState, useEffect } from 'react';
import { Plus, Search, Download, Trash2, Edit2, Filter } from 'lucide-react';
import { api } from '../services/api';
import { exportToExcel } from '../utils/exportUtils';
import { formatCurrency } from '../utils/formatters';
import { ProcurementEditModal } from '../modals/EditModals';
import useTableControls from '../utils/useTableControls';
import SortableHeader from '../components/SortableHeader';

const BATCH_COLUMNS = [
  { key: 'id', sortable: true, filterable: true },
  { key: 'date', sortable: true, filterable: true },
  { key: 'style_no', sortable: true, filterable: true },
  { key: 'inventory', sortable: true, filterable: true },
  { key: 'purchase_rate', sortable: true, filterable: true },
  { key: 'total_value', sortable: true, filterable: true },
];

const DAILY_COLUMNS = [
  { key: 'date', sortable: true, filterable: true },
  { key: 'style_count', sortable: true, filterable: true },
  { key: 'total_units', sortable: true, filterable: true },
  { key: 'daily_gross_total', sortable: true, filterable: true },
  { key: 'avg_purchase_rate', sortable: true, filterable: true },
];

export default function ProcurementView() {
  const [batches, setBatches] = useState([]);
  const [dailySummary, setDailySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('batches');

  // New batch form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [styleNo, setStyleNo] = useState('');
  const [inventory, setInventory] = useState(10);
  const [purchaseRate, setPurchaseRate] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getProcurement(), api.getProcurementDaily()])
      .then(([bList, dList]) => {
        setBatches(bList);
        setDailySummary(dList);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this procurement batch?')) return;
    try {
      await api.deleteProcurement(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createProcurement({
        date,
        style_no: styleNo.trim(),
        inventory: parseInt(inventory, 10),
        purchase_rate: parseFloat(purchaseRate),
      });
      setShowAddModal(false);
      setStyleNo('');
      setPurchaseRate('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await api.updateProcurement(id, updatedData);
      setEditingBatch(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const searchFilteredBatches = batches.filter((b) =>
    b.style_no.toLowerCase().includes(search.toLowerCase()) || b.date.includes(search)
  );

  // Column sort/filter for batches
  const batchControls = useTableControls({ data: searchFilteredBatches, columns: BATCH_COLUMNS });
  const filteredBatches = batchControls.processedData;

  // Column sort/filter for daily summary
  const dailyControls = useTableControls({ data: dailySummary, columns: DAILY_COLUMNS });
  const filteredDaily = dailyControls.processedData;

  const batchHeaderProps = {
    sortConfig: batchControls.sortConfig,
    columnFilters: batchControls.columnFilters,
    onSort: batchControls.requestSort,
    clearSort: batchControls.clearSort,
    getUniqueValues: batchControls.getUniqueValues,
    getValueCounts: batchControls.getValueCounts,
    isFilterActive: batchControls.isFilterActive,
    onToggleFilter: batchControls.toggleFilterValue,
    onSelectOnlyFilter: batchControls.selectOnlyFilter,
    onSelectAll: batchControls.selectAllFilter,
    onDeselectAll: batchControls.deselectAllFilter,
    onClearFilter: batchControls.clearFilter,
  };

  const dailyHeaderProps = {
    sortConfig: dailyControls.sortConfig,
    columnFilters: dailyControls.columnFilters,
    onSort: dailyControls.requestSort,
    clearSort: dailyControls.clearSort,
    getUniqueValues: dailyControls.getUniqueValues,
    getValueCounts: dailyControls.getValueCounts,
    isFilterActive: dailyControls.isFilterActive,
    onToggleFilter: dailyControls.toggleFilterValue,
    onSelectOnlyFilter: dailyControls.selectOnlyFilter,
    onSelectAll: dailyControls.selectAllFilter,
    onDeselectAll: dailyControls.deselectAllFilter,
    onClearFilter: dailyControls.clearFilter,
  };

  const activeFilterCount = activeSubTab === 'batches' ? batchControls.activeFilterCount : dailyControls.activeFilterCount;
  const clearCurrentFilters = activeSubTab === 'batches' ? batchControls.clearAllFilters : dailyControls.clearAllFilters;

  return (
    <div className="space-y-4">
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3" data-tour="proc-hud">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="relative w-full sm:w-64" data-tour="proc-search">
            <label htmlFor="proc-search-input" className="sr-only">Search SKU or Date</label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              id="proc-search-input"
              name="proc_search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SKU or Date..."
              style={{ paddingLeft: '2.5rem' }}
              className="input-field text-xs h-9 bg-slate-900 border-slate-700"
            />
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearCurrentFilters}
              className="px-2.5 py-1 text-xs rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Clear all active column filters"
            >
              <Filter className="w-3 h-3" />
              <span>Filters ({activeFilterCount})</span>
              <span className="text-blue-400 font-bold ml-0.5">✕</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-white/10" data-tour="proc-subtabs">
            <button
              onClick={() => setActiveSubTab('batches')}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${activeSubTab === 'batches' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Inward Batches
            </button>
            <button
              onClick={() => setActiveSubTab('daily')}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${activeSubTab === 'daily' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Daily Supply Summary
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => exportToExcel(batches, `Procurement_Batches_${new Date().toISOString().split('T')[0]}.xlsx`, 'Transactions')}
            className="btn btn-outline text-xs px-3 h-9"
            data-tour="proc-export"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary text-xs px-3.5 h-9" data-tour="proc-add-btn">
            <Plus className="w-3.5 h-3.5" />
            <span>Inward Batch</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'batches' ? (
        <div className="glass-panel overflow-hidden border border-white/10" data-tour="proc-table">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-white/10">
                <tr>
                  <SortableHeader label="#" columnKey="id" sortable {...batchHeaderProps} />
                  <SortableHeader label="Arrival Date" columnKey="date" sortable {...batchHeaderProps} />
                  <SortableHeader label="Style SKU" columnKey="style_no" sortable filterable {...batchHeaderProps}
                    activeFilterValues={batchControls.columnFilters['style_no']}
                    extraProps={{ 'data-tour': 'proc-col-sku' }}
                  />
                  <SortableHeader label="Inward Inventory" columnKey="inventory" sortable align="center" {...batchHeaderProps}
                    extraProps={{ 'data-tour': 'proc-col-qty' }}
                  />
                  <SortableHeader label="Purchase Rate" columnKey="purchase_rate" sortable align="right" {...batchHeaderProps}
                    extraProps={{ 'data-tour': 'proc-col-rate' }}
                  />
                  <SortableHeader label="Total Batch Value" columnKey="total_value" sortable align="right" {...batchHeaderProps}
                    extraProps={{ 'data-tour': 'proc-col-value' }}
                  />
                  <th className="py-3 px-4 text-center" data-tour="proc-col-actions">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan="7" className="py-8 text-center text-slate-400">Loading procurement batches...</td></tr>
                ) : filteredBatches.length === 0 ? (
                  <tr><td colSpan="7" className="py-8 text-center text-slate-400">No batches found.</td></tr>
                ) : (
                  filteredBatches.map((b) => (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{b.id}</td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono">{b.date}</td>
                      <td className="py-3 px-4 font-bold text-white uppercase">{b.style_no}</td>
                      <td className="py-3 px-4 text-center font-semibold text-white">{b.inventory}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatCurrency(b.purchase_rate)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-white font-mono">{formatCurrency(b.total_value)}</td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setEditingBatch(b)} className="p-1 text-slate-400 hover:text-white" aria-label="Edit batch">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(b.id)} className="p-1 text-slate-400 hover:text-rose-400" aria-label="Delete batch">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredBatches.length > 0 && (() => {
                const totalUnits = filteredBatches.reduce((a, b) => a + (b.inventory || 0), 0);
                const totalVal = filteredBatches.reduce((a, b) => a + (b.total_value || 0), 0);
                const avgRate = totalUnits > 0 ? totalVal / totalUnits : 0;
                return (
                  <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-bold text-white">
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs text-blue-400">TOTAL</td>
                      <td className="py-3 px-4 text-slate-300 text-xs">{filteredBatches.length} Batches</td>
                      <td className="py-3 px-4 text-slate-400">-</td>
                      <td className="py-3 px-4 text-center font-bold text-white text-xs">{totalUnits}</td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-slate-300">{formatCurrency(avgRate)} (Avg)</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400 font-mono text-xs">{formatCurrency(totalVal)}</td>
                      <td className="py-3 px-4 text-center text-slate-400">-</td>
                    </tr>
                  </tfoot>
                );
              })()}
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-white/10">
                <tr>
                  <SortableHeader label="Date" columnKey="date" sortable {...dailyHeaderProps} />
                  <SortableHeader label="Distinct Styles" columnKey="style_count" sortable align="center" {...dailyHeaderProps} />
                  <SortableHeader label="Total Inward Units" columnKey="total_units" sortable align="center" {...dailyHeaderProps} />
                  <SortableHeader label="Daily Gross Procurement" columnKey="daily_gross_total" sortable align="right" {...dailyHeaderProps} />
                  <SortableHeader label="Avg Purchase Rate" columnKey="avg_purchase_rate" sortable align="right" {...dailyHeaderProps} />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDaily.map((d) => (
                  <tr key={d.date} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-white font-mono">{d.date}</td>
                    <td className="py-3 px-4 text-center">{d.style_count}</td>
                    <td className="py-3 px-4 text-center font-semibold text-white">{d.total_units}</td>
                    <td className="py-3 px-4 text-right font-semibold text-blue-400 font-mono">{formatCurrency(d.daily_gross_total)}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(d.avg_purchase_rate)}</td>
                  </tr>
                ))}
              </tbody>
              {filteredDaily.length > 0 && (() => {
                const totalUnits = filteredDaily.reduce((a, d) => a + (d.total_units || 0), 0);
                const totalGross = filteredDaily.reduce((a, d) => a + (d.daily_gross_total || 0), 0);
                const avgRate = totalUnits > 0 ? totalGross / totalUnits : 0;
                return (
                  <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-bold text-white">
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs text-blue-400">TOTAL</td>
                      <td className="py-3 px-4 text-center text-slate-300 text-xs">{filteredDaily.length} Days</td>
                      <td className="py-3 px-4 text-center font-bold text-white text-xs">{totalUnits}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400 font-mono text-xs">{formatCurrency(totalGross)}</td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-slate-300">{formatCurrency(avgRate)} (Avg)</td>
                    </tr>
                  </tfoot>
                );
              })()}
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 border border-white/15">
            <h3 className="font-bold text-white text-base mb-4 pb-2 border-b border-white/10">Record Inward Procurement Batch</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label htmlFor="proc-date" className="text-xs text-slate-300 block mb-1">Date</label>
                <input id="proc-date" name="proc_date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input-field" />
              </div>
              <div>
                <label htmlFor="proc-style" className="text-xs text-slate-300 block mb-1">Style SKU</label>
                <input id="proc-style" name="proc_style" type="text" value={styleNo} onChange={(e) => setStyleNo(e.target.value)} placeholder="e.g. DE26030B" required className="input-field uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="proc-units" className="text-xs text-slate-300 block mb-1">Units Received</label>
                  <input id="proc-units" name="proc_units" type="number" min="1" value={inventory} onChange={(e) => setInventory(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label htmlFor="proc-rate" className="text-xs text-slate-300 block mb-1">Purchase Rate ($)</label>
                  <input id="proc-rate" name="proc_rate" type="number" step="0.01" value={purchaseRate} onChange={(e) => setPurchaseRate(e.target.value)} required className="input-field" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary text-xs">Save Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Procurement Batch Edit Modal */}
      <ProcurementEditModal
        batch={editingBatch}
        isOpen={!!editingBatch}
        onClose={() => setEditingBatch(null)}
        onSuccess={loadData}
      />
    </div>
  );
}
