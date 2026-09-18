import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Database, 
  FileSpreadsheet, 
  FolderArchive, 
  BadgeDollarSign, 
  ShieldAlert, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  HardDrive,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function StatusView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchStatus = () => {
    setLoading(true);
    setError(null);
    api.getSystemStatus()
      .then((res) => {
        setData(res);
        setLastRefreshed(new Date().toLocaleTimeString());
      })
      .catch((err) => {
        console.error('Failed to fetch system status:', err);
        setError(err.message || 'Failed to connect to backend status service');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const copyUrl = (url) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">System Health & Backend Status</h1>
              {data && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  data.overall_status === 'HEALTHY' 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${data.overall_status === 'HEALTHY' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {data.overall_status} ({data.checks_passed}/{data.total_checks} Checks Passed)
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              Live multi-subsystem diagnostics: Database, 3NF CSVs, Excel Workbooks, Financial Integrity & Quarantine Buffers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700/80 transition-all disabled:opacity-50 shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Re-run Diagnostics</span>
          </button>
          <a
            href="/status"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-emerald-600/20"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Dedicated /status URL</span>
          </a>
          <a
            href="/api/status"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-sm font-mono rounded-xl border border-slate-700/60 transition-all"
          >
            <span>JSON API</span>
          </a>
        </div>
      </div>

      {/* URL Quick-Access Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/20 p-4 rounded-xl border border-blue-800/30 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌐</span>
          <div>
            <span className="text-blue-300 font-semibold">Standalone Status URL: </span>
            <code className="text-xs font-mono bg-blue-950/80 text-blue-200 px-2 py-1 rounded border border-blue-700/40 ml-1">
              /status
            </code>
            <span className="text-slate-400 ml-2">or direct API</span>
            <code className="text-xs font-mono bg-blue-950/80 text-blue-200 px-2 py-1 rounded border border-blue-700/40 ml-1">
              /api/status
            </code>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => copyUrl('/status')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Link!' : 'Copy /status URL'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>Error loading backend telemetry: {error}</span>
        </div>
      )}

      {loading && !data && (
        <div className="flex flex-col items-center justify-center p-16 space-y-4">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-slate-400 text-sm">Querying backend subsystem probes...</p>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: API Service & Process Uptime */}
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-slate-200">API Service & Runtime</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {data.api_service.status}
              </span>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span>Process Uptime:</span>
                <span className="font-mono text-slate-200 font-medium">{data.api_service.uptime_human}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Memory RSS:</span>
                <span className="font-mono text-slate-200 font-medium">{data.api_service.memory_rss_mb} MB</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Process PID:</span>
                <span className="font-mono text-slate-200 font-medium">{data.api_service.process_id}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Diagnostic Latency:</span>
                <span className="font-mono text-emerald-400 font-medium">{data.diagnostic_latency_ms} ms</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Python / Platform:</span>
                <span className="font-mono text-slate-300 text-xs">v{data.api_service.python_version}</span>
              </div>
            </div>
          </div>

          {/* Card 2: SQLite Database & Table Audits */}
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-slate-200">Database & Records</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {data.database.status}
              </span>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span>Ping Latency:</span>
                <span className="font-mono text-emerald-400 font-medium">{data.database.ping_latency_ms} ms</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>DB File Size:</span>
                <span className="font-mono text-slate-200 font-medium">{data.database.file_size}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Total Live Records:</span>
                <span className="font-mono text-purple-300 font-bold">{data.database.total_records.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-800/60 grid grid-cols-2 gap-1.5 text-xs font-mono">
                {Object.entries(data.database.tables).map(([table, count]) => (
                  <div key={table} className="flex justify-between bg-slate-800/40 px-2 py-1 rounded">
                    <span className="text-slate-400 truncate mr-1" title={table}>{table.replace(/_/g, ' ')}:</span>
                    <span className="text-slate-200 font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Financial Zero-Drift Integrity */}
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <BadgeDollarSign className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-slate-200">Zero-Drift Financials</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {data.financial_engine.status}
              </span>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span>Gross Profit Identity:</span>
                <span className="text-emerald-400 font-medium text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Zero-Drift Verified
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Gross Revenue:</span>
                <span className="font-mono text-slate-200 font-medium">${data.financial_engine.gross_profit_identity.gross_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Total System COGS:</span>
                <span className="font-mono text-slate-200 font-medium">${data.financial_engine.gross_profit_identity.cogs.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Adjusted Realized Cash:</span>
                <span className="font-mono text-emerald-300 font-medium">${data.financial_engine.realized_cash_identity.adjusted_realized_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Bank Running Sum:</span>
                <span className="font-mono text-amber-300 font-semibold">${data.financial_engine.bank_ledger_continuity.ledger_final_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Quarantine Shield */}
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h3 className="font-semibold text-slate-200">Reverse Logistics Shield</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {data.quarantine_shield.status}
              </span>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span>Total Quarantined:</span>
                <span className="font-mono text-rose-400 font-bold">{data.quarantine_shield.total_quarantined_units} units</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>RTO Dock Buffer:</span>
                <span className="font-mono text-slate-200">{data.quarantine_shield.rto_dock_holding_units} units (${data.quarantine_shield.rto_dock_holding_value.toFixed(2)})</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Customer Return Intake:</span>
                <span className="font-mono text-slate-200">{data.quarantine_shield.cr_dock_holding_units} units (${data.quarantine_shield.cr_dock_holding_value.toFixed(2)})</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Exchange Dock Intake:</span>
                <span className="font-mono text-slate-200">{data.quarantine_shield.exchange_dock_intake_units} unit</span>
              </div>
              <p className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                🛡️ Sellable inventory is fully shielded from uninspected dock intake.
              </p>
            </div>
          </div>

          {/* Card 5: Master Excel Workbooks */}
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-teal-400" />
                <h3 className="font-semibold text-slate-200">Master Excel Workbooks</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {data.excel_workbooks.status}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-2.5 bg-slate-800/40 rounded-lg space-y-1">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-slate-200 font-semibold">Sales_Inventory.xlsx</span>
                  <span className="text-emerald-400">Active ({data.excel_workbooks.sales_inventory_workbook.size_human})</span>
                </div>
                <div className="text-xs text-slate-400">
                  {data.excel_workbooks.sales_inventory_workbook.sheet_count} Sheets: {data.excel_workbooks.sales_inventory_workbook.sheets.join(', ')}
                </div>
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-lg space-y-1">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-slate-200 font-semibold">Logistic.xlsx</span>
                  <span className="text-emerald-400">Active ({data.excel_workbooks.logistic_workbook.size_human})</span>
                </div>
                <div className="text-xs text-slate-400">
                  {data.excel_workbooks.logistic_workbook.sheet_count} Sheets: {data.excel_workbooks.logistic_workbook.sheets.join(', ')}
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: 3NF CSV Ledgers */}
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FolderArchive className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-slate-200">Standard 3NF CSVs</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {data.csv_ledgers.status}
              </span>
            </div>
            <div className="space-y-1.5 text-xs font-mono max-h-56 overflow-y-auto pr-1">
              {Object.entries(data.csv_ledgers.files).map(([file, info]) => (
                <div key={file} className="flex justify-between items-center p-1.5 bg-slate-800/40 rounded">
                  <span className="text-slate-300 truncate mr-2">{file}</span>
                  <span className="text-emerald-400 flex-shrink-0">{info.line_count} lines</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {lastRefreshed && (
        <div className="text-center text-xs text-slate-400 pt-2">
          Diagnostic telemetry refreshed at {lastRefreshed} &bull; Auto-refresh enabled (15s)
        </div>
      )}
    </div>
  );
}
