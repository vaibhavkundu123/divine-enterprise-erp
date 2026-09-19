import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Filter } from 'lucide-react';
import { api } from '../services/api';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { AdEditModal } from '../modals/EditModals';
import { formatCurrency } from '../utils/formatters';
import useTableControls from '../utils/useTableControls';
import SortableHeader from '../components/SortableHeader';

const COLUMNS = [
  { key: 'date', sortable: true, filterable: true },
  { key: 'platform', sortable: true, filterable: true },
  { key: 'amount', sortable: true, filterable: true },
  { key: 'notes', sortable: true, filterable: true, getValue: (r) => r.notes || '—' },
];

export default function AdsView() {
  const [ads, setAds] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingAd, setEditingAd] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New ad spend form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [platform, setPlatform] = useState('Meesho Ads');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getAds(), api.getAdSummary()])
      .then(([adList, sum]) => {
        setAds(adList);
        setSummary(sum);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete ad spend entry?')) return;
    try {
      await api.deleteAd(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createAd({
        date,
        platform,
        amount: parseFloat(amount),
        notes,
      });
      setShowAddModal(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const searchFiltered = ads.filter((a) =>
    a.platform.toLowerCase().includes(search.toLowerCase()) ||
    a.date.includes(search) ||
    (a.notes && a.notes.toLowerCase().includes(search.toLowerCase()))
  );

  // Column sort/filter
  const {
    sortConfig, columnFilters, requestSort, clearSort, getUniqueValues, getValueCounts,
    isFilterActive, toggleFilterValue, selectOnlyFilter, selectAllFilter, deselectAllFilter,
    clearFilter, clearAllFilters, activeFilterCount, processedData,
  } = useTableControls({ data: searchFiltered, columns: COLUMNS });

  const filtered = processedData;

  const sharedHeaderProps = {
    sortConfig, columnFilters, onSort: requestSort, clearSort, getUniqueValues, getValueCounts,
    isFilterActive, onToggleFilter: toggleFilterValue, onSelectOnlyFilter: selectOnlyFilter,
    onSelectAll: selectAllFilter, onDeselectAll: deselectAllFilter, onClearFilter: clearFilter,
  };

  return (
    <div className="space-y-4">

      {/* Control Bar */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3" data-tour="ads-hud">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="relative w-full sm:w-64" data-tour="ads-search">
            <label htmlFor="ads-search-input" className="sr-only">Search campaign or platform</label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              id="ads-search-input"
              name="ads_search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaign or platform..."
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
          <button
            onClick={() => exportToExcel(filtered, `Ad_Spend_${new Date().toISOString().split('T')[0]}.xlsx`, 'Ad Spend')}
            className="btn btn-outline text-xs px-3 h-9"
            data-tour="ads-export"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary text-xs px-3.5 h-9" data-tour="ads-add-btn">
            <Plus className="w-3.5 h-3.5" />
            <span>Log Ad Spend</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden border border-white/10" data-tour="ads-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4 text-center">Sl. No.</th>
                <SortableHeader label="Date" columnKey="date" sortable {...sharedHeaderProps} />
                <SortableHeader label="Platform Channel" columnKey="platform" sortable filterable {...sharedHeaderProps}
                  activeFilterValues={columnFilters['platform']}
                  extraProps={{ 'data-tour': 'ads-col-platform' }}
                />
                <SortableHeader label="Amount ($)" columnKey="amount" sortable align="right" {...sharedHeaderProps}
                  extraProps={{ 'data-tour': 'ads-col-amount' }}
                />
                <SortableHeader label="Campaign Notes" columnKey="notes" sortable {...sharedHeaderProps}
                  extraProps={{ 'data-tour': 'ads-col-notes' }}
                />
                <th className="py-3 px-4 text-center" data-tour="ads-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-400">Loading ad spend...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-400">No ad records found.</td></tr>
              ) : (
                filtered.map((a, idx) => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-400 text-xs">{idx + 1}</td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono">{a.date}</td>
                    <td className="py-3 px-4 font-semibold text-blue-400">{a.platform}</td>
                    <td className="py-3 px-4 text-right font-bold text-white font-mono">{formatCurrency(a.amount)}</td>
                    <td className="py-3 px-4 text-slate-400">{a.notes || '-'}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setEditingAd(a)} className="p-1 text-slate-400 hover:text-white" aria-label="Edit ad spend">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(a.id)} className="p-1 text-slate-400 hover:text-rose-400" aria-label="Delete ad spend">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
              {filtered.length > 0 && (() => {
                const totalAmount = filtered.reduce((acc, a) => acc + (a.amount || 0), 0);
                return (
                  <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-bold text-white">
                    <tr>
                      <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                      <td className="py-3 px-4 font-mono text-xs text-blue-400">TOTAL</td>
                      <td className="py-3 px-4 text-slate-300 text-xs">{filtered.length} Campaigns</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400 font-mono text-xs">{formatCurrency(totalAmount)}</td>
                      <td className="py-3 px-4 text-slate-400 text-xs">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                    </tr>
                  </tfoot>
                );
              })()}
            </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 border border-white/15">
            <h3 className="font-bold text-white text-base mb-4 pb-2 border-b border-white/10">Log Advertising Expense</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label htmlFor="ad-date" className="text-xs text-slate-300 block mb-1">Date</label>
                <input id="ad-date" name="ad_date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input-field" />
              </div>
              <div>
                <label htmlFor="ad-platform" className="text-xs text-slate-300 block mb-1">Platform Channel</label>
                <select id="ad-platform" name="ad_platform" value={platform} onChange={(e) => setPlatform(e.target.value)} className="input-field">
                  <option value="Meesho Ads">Meesho Ads</option>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Influencer">Influencer</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok/Pinterest">TikTok/Pinterest</option>
                  <option value="Offline / Other">Offline / Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="ad-amount" className="text-xs text-slate-300 block mb-1">Amount ($)</label>
                <input id="ad-amount" name="ad_amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required className="input-field" />
              </div>
              <div>
                <label htmlFor="ad-notes" className="text-xs text-slate-300 block mb-1">Campaign Notes</label>
                <textarea id="ad-notes" name="ad_notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-field" placeholder="Targeting, creative notes..." />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary text-xs">Save Spend</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingAd && (
        <AdEditModal
          ad={editingAd}
          isOpen={true}
          onClose={() => setEditingAd(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
