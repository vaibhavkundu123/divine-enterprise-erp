import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  RotateCcw,
  Undo2,
  ArrowLeftRight,
  Truck,
  Megaphone,
  Landmark,
  TrendingUp,
  History,
  CheckCircle2,
  RefreshCw,
  Layers,
  Database,
  ShieldCheck,
  X,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  onSyncClick,
  isSyncing,
  mobileOpen,
  setMobileOpen,
  kpis,
  onStartMasterTour,
  onStartTabTour,
}) {
  const navSections = [
    {
      title: 'CORE INTELLIGENCE',
      items: [
        { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
        { id: 'analytics', label: 'Financial Analytics', icon: TrendingUp },
        { id: 'audit', label: 'Audit Trail & Logs', icon: History },
        { id: 'status', label: 'System Health & Checks', icon: ShieldCheck, badge: 'Live', badgeColor: 'emerald' },
      ],
    },
    {
      title: 'OPERATIONS & INVENTORY',
      items: [
        { id: 'sales', label: 'Sales Ledger', icon: ShoppingCart },
        {
          id: 'stock',
          label: 'Stock Matrix',
          icon: Package,
          badge: kpis?.low_stock_count > 0 ? `${kpis.low_stock_count} Low` : null,
          badgeColor: 'amber',
        },
        { id: 'procurement', label: 'Procurement & POs', icon: Truck },
      ],
    },
    {
      title: 'REVERSE LOGISTICS',
      items: [
        {
          id: 'rto',
          label: 'Courier RTO Dock',
          icon: RotateCcw,
          badge: kpis?.rto_holding_units > 0 ? `${kpis.rto_holding_units} Hold` : null,
          badgeColor: 'blue',
        },
        {
          id: 'returns',
          label: 'Customer Returns',
          icon: Undo2,
          badge: kpis?.cr_holding_units > 0 ? `${kpis.cr_holding_units} Hold` : null,
          badgeColor: 'blue',
        },
        {
          id: 'exchanges',
          label: 'Exchanges & Swaps',
          icon: ArrowLeftRight,
          badge: (kpis?.exchange_holding_units || kpis?.exchange_intake_units) > 0 ? `${kpis?.exchange_holding_units || kpis?.exchange_intake_units} Hold` : null,
          badgeColor: 'blue',
        },
      ],
    },
    {
      title: 'TREASURY & MARKETING',
      items: [
        { id: 'ads', label: 'Marketing & ROAS', icon: Megaphone },
        { id: 'bank', label: 'Bank Treasury', icon: Landmark },
      ],
    },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d121f] border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Workspace Header */}
        <div className="p-3.5 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-1 ring-white/20">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm text-white tracking-tight font-heading flex items-center gap-1.5">
                  Divine Enterprise
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Live"></span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <span>Executive Ops</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-mono">v2.4</span>
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-3.5 scrollbar-thin">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="px-2.5 text-[9px] font-bold text-slate-400 tracking-wider uppercase font-mono">
                {section.title}
              </div>
              <div className="space-y-0.5 pt-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isTasks = item.id === 'tasks';

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/25'
                          : isTasks
                          ? 'text-emerald-300 hover:text-white hover:bg-emerald-500/10'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                            isActive
                              ? 'text-white'
                              : isTasks
                              ? 'text-emerald-400'
                              : 'text-slate-400 group-hover:text-blue-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor === 'emerald'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : item.badgeColor === 'amber'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sleek Compact Footer */}
        <div className="p-2.5 border-t border-slate-800/80 bg-[#0a0f1a] space-y-2">
          {/* Quick Sync & WAL Bar */}
          <div className="flex items-center justify-between gap-1.5">
            <button
              onClick={onSyncClick}
              disabled={isSyncing}
              className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all cursor-pointer disabled:opacity-50"
              title="Sync SQLite Database with Excel workbooks and CSV files"
            >
              <RefreshCw
                className={`w-3 h-3 text-blue-400 ${
                  isSyncing ? 'animate-spin' : ''
                }`}
              />
              <span>{isSyncing ? 'Syncing...' : 'Sync Excel'}</span>
            </button>

            <div className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <Database className="w-2.5 h-2.5 text-emerald-400" />
              <span>WAL</span>
            </div>
          </div>

          {/* Operator Profile */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white">
                HQ
              </div>
              <span className="text-[11px] font-medium text-slate-300">Admin Control</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
          </div>
        </div>
      </aside>
    </>
  );
}
