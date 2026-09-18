import React, { useState } from 'react';
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
  Plus,
  Menu,
  X,
  Database,
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onRecordSaleClick, onSyncClick, isSyncing }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales Orders', icon: ShoppingCart },
    { id: 'stock', label: 'Inventory', icon: Package },
    { id: 'rto', label: 'RTO Returns', icon: RotateCcw },
    { id: 'returns', label: 'Customer Returns', icon: Undo2 },
    { id: 'exchanges', label: 'Exchanges', icon: ArrowLeftRight },
    { id: 'procurement', label: 'Procurement', icon: Truck },
    { id: 'ads', label: 'Marketing', icon: Megaphone },
    { id: 'bank', label: 'Banking', icon: Landmark },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { id: 'tasks', label: 'Roadmap & Tasks', icon: CheckCircle2, badge: '38/38' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-14">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <Package className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-base text-white tracking-tight font-heading">
                Divine Enterprise
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Live Connected
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onSyncClick}
              disabled={isSyncing}
              className="btn btn-outline text-xs px-3 py-1.5 h-8 font-medium"
              title="Sync SQLite Database with Excel workbooks and CSV files"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Spreadsheets'}</span>
            </button>

            <button
              onClick={onRecordSaleClick}
              className="btn btn-primary text-xs px-3.5 py-1.5 h-8 font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Record Sale</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Tab Navigation Bar */}
        <div className="hidden lg:flex items-center justify-between border-t border-slate-800/80 overflow-x-auto scrollbar-none py-1">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isTasks = item.id === 'tasks';

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isTasks
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-blue-500/15 text-blue-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 pl-4 font-mono">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>SQLite WAL</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Flyout */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 shadow-lg">
          <div className="grid grid-cols-2 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
