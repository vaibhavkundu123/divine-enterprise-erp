import React, { useState, useEffect } from 'react';
import { Download, Layers, ShoppingCart, Megaphone } from 'lucide-react';
import { api } from '../services/api';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

export default function AnalyticsView() {
  const [dailySales, setDailySales] = useState([]);
  const [dailyAds, setDailyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('both'); // 'both' | 'sales' | 'ads'

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getDailySales(), api.getDailyAds()])
      .then(([sList, aList]) => {
        setDailySales(Array.isArray(sList) ? sList : []);
        setDailyAds(Array.isArray(aList) ? aList : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const showSales = viewMode === 'both' || viewMode === 'sales';
  const showAds = viewMode === 'both' || viewMode === 'ads';

  const handleExportSales = (format = 'excel') => {
    const formatted = dailySales.map((r) => ({
      Date: r.date,
      'Orders / Sales': r.orders_count,
      'Units Sold': r.units_sold,
      'Gross Revenue ($)': r.gross_revenue,
      'Total COGS ($)': r.total_cogs,
      'Gross Profit ($)': r.gross_profit,
      'Gross Margin (%)': r.gross_margin,
    }));
    if (format === 'excel') {
      exportToExcel(formatted, `Daily_Sales_${new Date().toISOString().split('T')[0]}.xlsx`, 'Daily Sales');
    } else {
      exportToCSV(formatted, `daily_sales_${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  const handleExportAds = (format = 'excel') => {
    const formatted = dailyAds.map((r) => ({
      Date: r.date,
      'Campaign Count': r.campaign_count,
      'Platforms Used': r.platforms_used,
      'Daily Ad Spend ($)': r.total_ad_spend,
    }));
    if (format === 'excel') {
      exportToExcel(formatted, `Daily_Ads_${new Date().toISOString().split('T')[0]}.xlsx`, 'Daily Ad Spend');
    } else {
      exportToCSV(formatted, `daily_ads_${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & View Controls */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'both'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>📑</span>
            <span>View Both Tables</span>
          </button>

          <button
            onClick={() => setViewMode('sales')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'sales'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🛒</span>
            <span>Daily Sales Only</span>
          </button>

          <button
            onClick={() => setViewMode('ads')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'ads'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>📢</span>
            <span>Daily Ad Spend Only</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {showSales && (
            <button
              onClick={() => handleExportSales('excel')}
              className="btn btn-outline text-xs px-3 h-8"
              title="Export Daily Sales Breakdown to Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Sales</span>
            </button>
          )}

          {showAds && (
            <button
              onClick={() => handleExportAds('excel')}
              className="btn btn-outline text-xs px-3 h-8"
              title="Export Daily Ad Spend to Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ads</span>
            </button>
          )}
        </div>
      </div>

      {/* TABLE 1: DAILY SALES & GROSS PROFIT BREAKDOWN */}
      {showSales && (
        <div className="glass-panel overflow-hidden border border-slate-800">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white font-heading flex items-center gap-2">
                <span>🛒</span>
                <span>Table 1: Daily Sales & Gross Profit Breakdown</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated solely from sales orders</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              {dailySales.length} Days Recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Orders / Sales</th>
                  <th className="py-3 px-4 text-center">Units Sold</th>
                  <th className="py-3 px-4 text-right">Gross Revenue ($)</th>
                  <th className="py-3 px-4 text-right">Total COGS ($)</th>
                  <th className="py-3 px-4 text-right">Gross Profit ($)</th>
                  <th className="py-3 px-4 text-right">Gross Margin (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400">Loading daily sales telemetry...</td>
                  </tr>
                ) : dailySales.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400">No daily sales recorded yet.</td>
                  </tr>
                ) : (
                  dailySales.map((row) => (
                    <tr key={row.date} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-white font-mono">{row.date}</td>
                      <td className="py-3 px-4 text-center font-mono text-blue-400">{row.orders_count}</td>
                      <td className="py-3 px-4 text-center font-semibold text-white font-mono">{row.units_sold}</td>
                      <td className="py-3 px-4 text-right font-semibold text-white font-mono">{formatCurrency(row.gross_revenue)}</td>
                      <td className="py-3 px-4 text-right text-rose-300 font-mono">{formatCurrency(row.total_cogs)}</td>
                      <td className={`py-3 px-4 text-right font-bold font-mono ${row.gross_profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatCurrency(row.gross_profit)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${row.gross_profit >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                          {formatPercent(row.gross_margin)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {dailySales.length > 0 && (() => {
                const totalOrders = dailySales.reduce((a, r) => a + (r.orders_count || 0), 0);
                const totalUnits = dailySales.reduce((a, r) => a + (r.units_sold || 0), 0);
                const totalRev = dailySales.reduce((a, r) => a + (r.gross_revenue || 0), 0);
                const totalCogs = dailySales.reduce((a, r) => a + (r.total_cogs || 0), 0);
                const totalProf = dailySales.reduce((a, r) => a + (r.gross_profit || 0), 0);
                const blMargin = totalRev > 0 ? ((totalProf / totalRev) * 100).toFixed(2) : '0.00';

                return (
                  <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-bold text-white sticky bottom-0">
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs text-blue-400">TOTAL ({dailySales.length} Days)</td>
                      <td className="py-3 px-4 text-center font-bold text-white text-xs">{totalOrders}</td>
                      <td className="py-3 px-4 text-center font-bold text-white text-xs">{totalUnits}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400 font-mono text-xs">{formatCurrency(totalRev)}</td>
                      <td className="py-3 px-4 text-right font-bold text-rose-400 font-mono text-xs">{formatCurrency(totalCogs)}</td>
                      <td className={`py-3 px-4 text-right font-bold font-mono text-xs ${totalProf >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatCurrency(totalProf)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${totalProf >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                          {blMargin}%
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                );
              })()}
            </table>
          </div>
        </div>
      )}

      {/* TABLE 2: DAILY ADVERTISEMENT SPEND BREAKDOWN */}
      {showAds && (
        <div className="glass-panel overflow-hidden border border-slate-800">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white font-heading flex items-center gap-2">
                <span>📢</span>
                <span>Table 2: Daily Advertisement Spend Breakdown</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated solely from marketing campaigns</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              {dailyAds.length} Days Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Campaign Count</th>
                  <th className="py-3 px-4">Platforms Used</th>
                  <th className="py-3 px-4 text-right">Daily Ad Spend ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">Loading daily ad telemetry...</td>
                  </tr>
                ) : dailyAds.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">No daily ad spend recorded yet.</td>
                  </tr>
                ) : (
                  dailyAds.map((row) => (
                    <tr key={row.date} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-white font-mono">{row.date}</td>
                      <td className="py-3 px-4 text-center font-mono text-purple-400">{row.campaign_count}</td>
                      <td className="py-3 px-4 text-slate-300 font-medium">{row.platforms_used || 'All Channels'}</td>
                      <td className="py-3 px-4 text-right font-bold text-cyan-400 font-mono">{formatCurrency(row.total_ad_spend)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {dailyAds.length > 0 && (() => {
                const totalCampaigns = dailyAds.reduce((a, r) => a + (r.campaign_count || 0), 0);
                const totalSpend = dailyAds.reduce((a, r) => a + (r.total_ad_spend || 0), 0);

                return (
                  <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-bold text-white sticky bottom-0">
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs text-blue-400">TOTAL ({dailyAds.length} Days)</td>
                      <td className="py-3 px-4 text-center font-bold text-white text-xs">{totalCampaigns}</td>
                      <td className="py-3 px-4 text-slate-400 text-xs">-</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400 font-mono text-xs">{formatCurrency(totalSpend)}</td>
                    </tr>
                  </tfoot>
                );
              })()}
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
