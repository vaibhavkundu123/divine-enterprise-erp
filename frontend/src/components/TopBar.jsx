import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Plus,
  RefreshCw,
  ChevronRight,
  Database,
  Layers,
  FileSpreadsheet,
  Sparkles,
  Compass,
  ChevronDown,
  BookOpen,
} from 'lucide-react';

export default function TopBar({
  activeTab,
  onRecordSaleClick,
  onSyncClick,
  isSyncing,
  setMobileOpen,
  onExportMaster,
  isExportingMaster,
  onStartMasterTour,
  onStartTabTour,
}) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsTourOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
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
      case 'status':
        return 'System Health & Backend Diagnostics';
      case 'tasks':
        return 'Verified Roadmap & Tasks (38/38)';
      default:
        return 'Operations';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 shrink-0 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
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
          data-tour="topbar-export"
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
          data-tour="topbar-sync"
          className="btn btn-outline text-xs px-2.5 sm:px-3 py-1.5 h-8 font-medium"
          title="Synchronize SQLite with Excel workbooks and CSV files"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-blue-400 ${isSyncing ? 'animate-spin' : ''}`}
          />
          <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Excel'}</span>
        </button>

        {/* Interactive Tour & Guides Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsTourOpen(!isTourOpen)}
            data-tour="topbar-tour"
            className="btn btn-outline text-xs px-2.5 sm:px-3 py-1.5 h-8 font-medium flex items-center gap-1.5 bg-gradient-to-r from-blue-950/60 to-indigo-950/60 hover:from-blue-900/60 hover:to-indigo-900/60 text-blue-300 border-blue-500/40 shadow-sm cursor-pointer"
            title="Open Interactive Tour & Guided Manuals"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden md:inline font-semibold">Tour & Manual</span>
            <ChevronDown className="w-3 h-3 text-blue-400" />
          </button>

          {isTourOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0d1322] border border-blue-500/30 rounded-xl shadow-2xl shadow-black/80 z-50 p-2 space-y-1.5 backdrop-blur-xl animate-fade-in">
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                Interactive Manual & Tours
              </div>

              {/* Master Tour Option */}
              <button
                onClick={() => {
                  setIsTourOpen(false);
                  if (onStartMasterTour) onStartMasterTour();
                }}
                className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800/80 transition-colors flex items-start gap-2.5 group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1">
                    <span>🌟 Full Platform Tour</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Multi-tab guided walkthrough of all 11 ERP subsystems.
                  </div>
                </div>
              </button>

              {/* Tab Tour Option */}
              <button
                onClick={() => {
                  setIsTourOpen(false);
                  if (onStartTabTour) onStartTabTour();
                }}
                className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800/80 transition-colors flex items-start gap-2.5 group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1">
                    <span>💡 Guide to {getTabLabel(activeTab)}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Deep-dive instructions and tips for this active screen.
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
