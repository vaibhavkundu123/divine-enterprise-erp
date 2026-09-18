import React, { useState, useEffect } from 'react';
import { History, Search, Download, Trash2, RefreshCw, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export default function AuditView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadLogs = () => {
    api.getAudit({
      category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
      search: search || undefined,
    })
      .then((data) => setLogs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, [selectedCategory, search]);

  // 5-second auto-refresh polling
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      loadLogs();
    }, 5000);
    return () => clearInterval(timer);
  }, [autoRefresh, selectedCategory, search]);

  const handleClear = async () => {
    if (!window.confirm('Archive active logs to persistent disk snapshot and clear active audit trail?')) return;
    try {
      const res = await api.clearAudit();
      alert(res.message);
      loadLogs();
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'DANGER':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Info className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const categories = ['ALL', 'SALE', 'AD_SPEND', 'RTO', 'CUSTOMER_RETURN', 'EXCHANGE', 'STOCK', 'SYNC', 'EXPORT', 'SYSTEM', 'BANK'];

  return (
    <div className="space-y-4">
      {/* Top Filter and Controls */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3" data-tour="audit-toolbar">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64" data-tour="audit-search">
            <label htmlFor="audit-search-input" className="sr-only">Search audit trail</label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              id="audit-search-input"
              name="audit_search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail..."
              style={{ paddingLeft: '2.5rem' }}
              className="input-field text-xs h-9 bg-slate-900 border-slate-700"
            />
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer select-none" data-tour="audit-poll">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-slate-700 text-blue-600 focus:ring-0"
            />
            <span>5s Live Poll</span>
          </label>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <a
            href="/api/audit/export-csv"
            download
            className="btn btn-outline text-xs px-3 h-9"
            data-tour="audit-export"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
          <button onClick={handleClear} className="btn btn-danger text-xs px-3 h-9" data-tour="audit-clear">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Archive & Clear</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" data-tour="audit-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Logs Stream Table */}
      <div className="glass-panel overflow-hidden border border-white/10" data-tour="audit-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4" data-tour="audit-col-cat">Domain Category</th>
                <th className="py-3 px-4" data-tour="audit-col-action">Action</th>
                <th className="py-3 px-4" data-tour="audit-col-summary">Summary</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-400">Streaming audit history...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-400">No matching audit events recorded.</td></tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{l.id}</td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">{l.timestamp}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-300 border border-white/10">
                        {l.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{l.action}</td>
                    <td className="py-3 px-4 text-slate-200">{l.summary}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{l.source}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1">
                        {getStatusIcon(l.status)}
                        <span className="text-[10px] font-semibold text-slate-400">{l.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {logs.length > 0 && (
              <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-bold text-white">
                <tr>
                  <td className="py-3 px-4 font-mono text-xs text-blue-400">TOTAL</td>
                  <td className="py-3 px-4 text-slate-300 text-xs">{logs.length} Events Logged</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">-</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">-</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">-</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">-</td>
                  <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
