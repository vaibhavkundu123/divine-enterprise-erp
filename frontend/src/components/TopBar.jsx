import React from 'react';
import {
  Menu,
  Plus,
  RefreshCw,
  ChevronRight,
  Database,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export default function TopBar({
  activeTab,
  onRecordSaleClick,
  onSyncClick,
  isSyncing,
  setMobileOpen,
  onExportMaster,
  isExportingMaster,
}) {
  const getTabLabel = (id) => {
    switch (id) {
      case 'dashboard':
        return 'Executive Overview';
      case 'sales':
        return 'Sales Ledger & Orders';
      case 'stock':
        return 'Stock Matrix & Inventory';
      case 'rto':
        return 'Courier RTO Returns Dock';
      case 'returns':
        return 'Customer Returns Processing';
      case 'exchanges':
        return 'Product Exchanges';
      case 'procurement':
        return 'Procurement & Purchase Orders';
      case 'ads':
        return 'Marketing Spend & Blended ROAS';
      case 'bank':
        return 'Bank Treasury & Reconciliation';
      case 'analytics':
        return 'Financial Analytics & Intelligence';
      case 'audit':
        return 'System Audit Trail & Security';
      case 'tasks':
        return 'Verified Roadmap & Tasks (38/38)';
      default:
        return 'Operations';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Open Sidebar Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="hidden sm:inline text-slate-400 hover:text-slate-200">Divine Enterprise</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="text-white font-semibold font-heading truncate">
            {getTabLabel(activeTab)}
          </span>
        </nav>
      </div>

      {/* Right: Quick Actions & Status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Master Excel Export Button */}
        <button
          onClick={onExportMaster}
          disabled={isExportingMaster}
          className="btn btn-primary text-xs px-2.5 sm:px-3 py-1.5 h-8 font-medium flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500"
          title="Fetch all module data and export Divine_Master_Ledger.xlsx with all sheets"
        >
          <FileSpreadsheet
            className={`w-3.5 h-3.5 ${isExportingMaster ? 'animate-spin' : ''}`}
          />
          <span className="hidden sm:inline">
            {isExportingMaster ? 'Exporting Master...' : 'Export Master Excel'}
          </span>
        </button>

        {/* Sync Button */}
        <button
          onClick={onSyncClick}
          disabled={isSyncing}
          className="btn btn-outline text-xs px-2.5 sm:px-3 py-1.5 h-8 font-medium"
          title="Synchronize SQLite with Excel workbooks and CSV files"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-blue-400 ${isSyncing ? 'animate-spin' : ''}`}
          />
          <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Excel'}</span>
        </button>

      </div>
    </header>
  );
}
