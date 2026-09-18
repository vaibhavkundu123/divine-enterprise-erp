import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  RotateCcw,
  Undo2,
  ArrowLeftRight,
  Zap,
  Sparkles,
  Play,
  BookOpen,
} from 'lucide-react';
import AICopilotBanner from '../components/AICopilotBanner';
import TrendWaveforms from '../components/TrendWaveforms';
import { api } from '../services/api';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

export default function DashboardView({
  kpis,
  copilotInsights,
  waveforms,
  horizon,
  onHorizonChange,
  onActionClick,
  onRestockDock,
  onRestockReturns,
  onRestockExchanges,
  onNavigateTab,
  onStartMasterTour,
  onStartTabTour,
}) {
  const [recentSales, setRecentSales] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);

  useEffect(() => {
    setLoadingSales(true);
    api.getSales()
      .then((data) => {
        if (Array.isArray(data)) {
          setRecentSales(data.slice(-5).reverse());
        }
      })
      .catch((err) => console.error('Failed to load recent sales:', err))
      .finally(() => setLoadingSales(false));
  }, []);

  if (!kpis) {
    return (
      <div className="p-16 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-medium text-slate-300">Loading operational telemetry...</p>
      </div>
    );
  }

  const isProfitPositive = (kpis.net_realized_profit || 0) >= 0;
  const lowStockItems = (kpis.low_stock_items || []).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 1. AI Copilot Action Recommendation Banner */}
      <AICopilotBanner
        insights={copilotInsights}
        onActionClick={onActionClick}
        onRestockDock={onRestockDock}
      />

      {/* 1.5 Interactive ERP Walkthrough & Subsystem Guide Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/70 to-slate-900/90 border border-blue-500/35 p-4 sm:p-5 shadow-lg shadow-blue-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight font-heading">
                Interactive ERP Walkthrough & Playable Manual
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                11 Subsystems
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Explore the multi-tab guided tour explaining all operational modules, 3-stage reverse logistics dock quarantines, live profit math simulators, and continuous zero-drift reconciliation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onStartTabTour}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all cursor-pointer flex items-center gap-1.5"
            title="Open Deep-Dive Guide for Executive Overview"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Dashboard Guide</span>
          </button>

          <button
            onClick={onStartMasterTour}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-1.5"
            title="Launch Full 11-Stage Platform Master Tour"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Master Tour</span>
          </button>
        </div>
      </div>

      {/* 2. Executive Hero KPIs (4 Hero Cards matching reference telemetry) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Net Realized Profit */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Net Realized Profit</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
              isProfitPositive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
            }`}>
              {isProfitPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {formatPercent(kpis.net_realized_margin)} Margin
            </span>
          </div>

          <div className={`text-2xl sm:text-3xl font-bold tracking-tight font-heading mt-1 ${
            isProfitPositive ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {formatCurrency(kpis.net_realized_profit)}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
            <span>Post-Ads & RTO Realized Cash</span>
            <span className="text-slate-300 font-mono text-[11px]">Gross: {formatCurrency(kpis.gross_profit)} (CR Fees: -{formatCurrency(kpis.cr_received_fees || 0)})</span>
          </div>
        </div>

        {/* Card 2: Net Realized Revenue */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Net Realized Revenue</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/25">
              {formatNumber(kpis.adjusted_units_sold || 0)} net units
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-heading mt-1">
            {formatCurrency(kpis.adjusted_revenue)}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
            <span>Gross: {formatCurrency(kpis.total_system_revenue || kpis.gross_sales_revenue)} (Refunds: -{formatCurrency(kpis.cr_realized_refunds || 0)})</span>
            <span className="text-slate-300 font-mono text-[11px]">AOV: {formatCurrency(kpis.aov)}</span>
          </div>
        </div>

        {/* Card 3: Marketing & Ad Spend */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Marketing & Ad Spend</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/25">
              {kpis.dispatched_roas > 0 ? `${kpis.dispatched_roas.toFixed(1)}x ROAS` : '0.0x ROAS'}
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-heading mt-1">
            {formatCurrency(kpis.total_ad_spend)}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
            <span>Active Campaigns</span>
            <span className="text-slate-300 font-mono text-[11px]">Adj: {kpis.adjusted_roas?.toFixed(2)}x</span>
          </div>
        </div>

        {/* Card 4: Sellable Inventory */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Sellable Inventory</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25">
              Inflow: {formatNumber(kpis.portfolio_units)}
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-heading mt-1">
            {formatNumber(kpis.usable_stock_units)} units
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
            <span>Valuation: {formatCurrency(kpis.warehouse_stock_valuation)}</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              kpis.low_stock_count > 0 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'text-slate-400'
            }`}>
              {kpis.low_stock_count} low stock
            </span>
          </div>
        </div>
      </div>

      {/* 3. Dock Operational Overview Strips (3 Strips matching localhost:5001) */}
      <div className="space-y-2.5">
        {/* Strip 1: RTO Pipeline Strip */}
        <div className="operational-strip border-blue-500/20 bg-slate-900/60">
          <div className="op-pill-group">
            <span className="op-pill">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>In-Transit RTO:</span>
              <strong className="text-amber-400">{kpis.in_transit_rto_units || 0} units</strong>
              <small className="text-slate-400 ml-0.5">({formatPercent(kpis.rto_rate)})</small>
            </span>

            <span className="op-pill">
              <Package className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Warehouse Staging Pile:</span>
              <strong className="text-purple-400">{kpis.rto_holding_units || 0} units</strong>
            </span>

            <span className="op-pill">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
              <span>Restocked:</span>
              <strong className="text-emerald-400">
                {Math.max(0, (kpis.rto_units || 0) - (kpis.in_transit_rto_units || 0) - (kpis.rto_holding_units || 0))} units
              </strong>
            </span>

            {kpis.rto_holding_units > 0 && (
              <button
                onClick={onRestockDock}
                className="btn btn-primary text-xs py-1 px-3 h-7 font-semibold shadow-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                title="Bulk Restock all received units into active stock"
              >
                ⚡ Bulk Restock All Holding ({kpis.rto_holding_units})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-400">
              Sync: <strong className="text-emerald-400 font-semibold">Active</strong>
            </span>
            <button
              onClick={() => onNavigateTab && onNavigateTab('analytics')}
              className="btn btn-outline text-xs py-1 px-2.5 h-7 text-slate-300 hover:text-white"
            >
              View Daily Ledger
            </button>
          </div>
        </div>

        {/* Strip 2: Customer Returns Strip */}
        <div className="operational-strip border-indigo-500/25 bg-slate-900/60">
          <div className="op-pill-group">
            <span className="op-pill">
              <Undo2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>In-Transit Returns:</span>
              <strong className="text-sky-400">{kpis.cr_in_transit_units || 0} units</strong>
              <small className="text-slate-400 ml-0.5">({formatPercent(kpis.cr_rate)})</small>
            </span>

            <span className="op-pill">
              <Package className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Warehouse Intake:</span>
              <strong className="text-purple-400">{kpis.cr_holding_units || 0} units</strong>
            </span>

            <span className="op-pill">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
              <span>Restocked:</span>
              <strong className="text-emerald-400">
                {Math.max(0, (kpis.cr_units || 0) - (kpis.cr_in_transit_units || 0) - (kpis.cr_holding_units || 0))} units
              </strong>
            </span>

            {kpis.cr_holding_units > 0 && (
              <button
                onClick={onRestockReturns}
                className="btn text-xs py-1 px-3 h-7 font-semibold text-white shadow-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                title="Bulk Restock all received customer return units into active stock"
              >
                ⚡ Bulk Restock All Intake ({kpis.cr_holding_units})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-400">
              Pipeline: <strong className="text-indigo-400 font-semibold">Active</strong>
            </span>
            <button
              onClick={() => onNavigateTab && onNavigateTab('returns')}
              className="btn btn-outline text-xs py-1 px-2.5 h-7 border-indigo-500/30 text-indigo-300 hover:text-white"
            >
              Customer Returns Hub ➔
            </button>
          </div>
        </div>

        {/* Strip 3: Item Exchanges Strip */}
        <div className="operational-strip border-emerald-500/25 bg-slate-900/60">
          <div className="op-pill-group">
            <span className="op-pill">
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>In-Transit Exchanges:</span>
              <strong className="text-blue-400">{kpis.exchange_in_transit_units || 0} units</strong>
              <small className="text-slate-400 ml-0.5">({formatPercent(kpis.exchange_rate)})</small>
            </span>

            <span className="op-pill">
              <Package className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Warehouse Intake:</span>
              <strong className="text-purple-400">{kpis.exchange_intake_units || 0} units</strong>
            </span>

            <span className="op-pill">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
              <span>Restocked:</span>
              <strong className="text-emerald-400">{kpis.exchange_restocked_units || 0} units</strong>
            </span>

            {kpis.exchange_intake_units > 0 && (
              <button
                onClick={onRestockExchanges}
                className="btn text-xs py-1 px-3 h-7 font-semibold text-white shadow-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                title="Bulk Restock all received exchange returns into active stock"
              >
                ⚡ Bulk Restock All Intake ({kpis.exchange_intake_units})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-400">
              Exchanges: <strong className="text-emerald-400 font-semibold">Active</strong>
            </span>
            <button
              onClick={() => onNavigateTab && onNavigateTab('exchanges')}
              className="btn btn-outline text-xs py-1 px-2.5 h-7 border-emerald-500/30 text-emerald-300 hover:text-white"
            >
              Item Exchanges Hub ➔
            </button>
          </div>
        </div>
      </div>

      {/* 4. Asymmetric Bento Section: 65% Financial Waveform vs 35% Logistics Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Bento: Financial Trends Chart (8 columns on lg) */}
        <div className="lg:col-span-8">
          <TrendWaveforms
            waveforms={waveforms}
            horizon={horizon}
            onHorizonChange={onHorizonChange}
          />
        </div>

        {/* Right Bento: Reverse Logistics Health & Quick Dock Actions (4 columns on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <RotateCcw className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-sm text-white font-heading">
                  Reverse Logistics Dock
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Live Dock
              </span>
            </div>

            {/* Courier RTO Status */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Courier RTO</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25">
                  {kpis.rto_holding_units} at Dock
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>RTO Rate: <strong className="text-slate-200">{formatPercent(kpis.rto_rate)}</strong></span>
                <span>{kpis.rto_units} parcels total</span>
              </div>

              {kpis.rto_holding_units > 0 && (
                <button
                  onClick={onRestockDock}
                  className="w-full mt-2 btn btn-primary text-xs py-1.5 h-7 font-medium"
                >
                  Restock All {kpis.rto_holding_units} Units to Warehouse
                </button>
              )}
            </div>

            {/* Customer Returns Status */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Undo2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Customer Returns</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/25">
                  {kpis.cr_holding_units} in Triage
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Return Rate: <strong className="text-slate-200">{formatPercent(kpis.cr_rate)}</strong></span>
                <span>{kpis.cr_units} returns</span>
              </div>
            </div>

            {/* Exchanges Status */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Product Exchanges</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  {kpis.exchange_units} Swapped
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Exchange Rate: <strong className="text-slate-200">{formatPercent(kpis.exchange_rate)}</strong></span>
                <span className="text-emerald-400 text-[11px] font-medium">Re-dispatch OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Quick Summary Widgets Grid (Recent Sales Snapshot & Low Stock Radar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget 1: Recent Sales Snapshot */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">🛒</span>
              <h3 className="font-bold text-sm text-white font-heading">
                Recent Sales Snapshot
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('sales')}
              className="btn btn-outline text-xs py-1 px-2.5 h-7 font-medium text-slate-300 hover:text-white"
            >
              Full Ledger ➔
            </button>
          </div>

          <div className="overflow-x-auto max-h-[240px]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Style No.</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Revenue</th>
                  <th className="py-2.5 px-3 text-right">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loadingSales ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400">Loading transactions...</td>
                  </tr>
                ) : recentSales.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400">No sales recorded yet</td>
                  </tr>
                ) : (
                  recentSales.map((s, idx) => (
                    <tr key={s.id || idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">{s.date}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[11px]">
                          {s.style_no}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-400">
                        {formatNumber(s.quantity_sold)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                        {formatCurrency(s.total_revenue || s.revenue)}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-mono font-bold ${
                        (s.gross_profit || s.profit || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {formatCurrency(s.gross_profit || s.profit)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Widget 2: Low Stock & Restock Radar */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <h3 className="font-bold text-sm text-white font-heading">
                Low Stock & Restock Radar
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('stock')}
              className="btn btn-outline text-xs py-1 px-2.5 h-7 font-medium text-slate-300 hover:text-white"
            >
              Stock Matrix ➔
            </button>
          </div>

          <div className="overflow-x-auto max-h-[240px]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Style No.</th>
                  <th className="py-2.5 px-3 text-right">Current Stock</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Restock Needed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lowStockItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-emerald-400 font-medium">
                      All styles sufficiently stocked
                    </td>
                  </tr>
                ) : (
                  lowStockItems.map((item, idx) => (
                    <tr key={item.style_no || idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-[11px]">
                          {item.style_no}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-400">
                        {item.stock_on_hand} units
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25">
                          {item.status || 'Low Stock'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                        +{item.reorder_needed || 10} units
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
