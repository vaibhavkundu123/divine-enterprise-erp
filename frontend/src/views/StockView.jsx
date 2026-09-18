import React, { useState, useEffect } from 'react';
import { Package, Search, Download, Filter, AlertCircle, RefreshCw, Layers, DollarSign } from 'lucide-react';
import { api } from '../services/api';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function StockView() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadStock = () => {
    setLoading(true);
    api.getStock()
      .then((data) => setStock(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStock();
  }, []);

  const filtered = stock.filter((item) => {
    const matchesSearch = item.style_no.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalValuation = stock.reduce((sum, item) => sum + (item.stock_valuation || 0), 0);
  const totalUnitsOnHand = stock.reduce((sum, item) => sum + (item.stock_on_hand || 0), 0);
  const lowStockCount = stock.filter((item) => item.status === 'Low Stock' || item.status === 'Out of Stock').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Stock':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold badge-instock">In Stock</span>;
      case 'Low Stock':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold badge-lowstock animate-pulse">Low Stock</span>;
      case 'Out of Stock':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold badge-outofstock">Out of Stock</span>;
      case 'Over Sold':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold badge-oversold">Over Sold</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  const handleExcelExport = () => {
    const formatted = filtered.map((item) => ({
      'Style No.': item.style_no,
      'Purchased (Inflow)': item.total_purchased,
      'Sold (Outflow)': item.total_sold,
      'Exchanged Out (Sent)': item.exch_out || 0,
      'Restocked RTO 🚚': item.rto_restocked || 0,
      'Restocked CR ↩': item.cr_restocked || 0,
      'Restocked Exch 🔄': item.exch_restocked || 0,
      'Stock on Hand': item.stock_on_hand,
      'Unit Cost ($)': item.unit_cost,
      'Stock Valuation ($)': item.stock_valuation,
      'Total Revenue ($)': item.total_revenue || 0,
      'Total Profit ($)': item.total_profit,
      'Stock Status': item.status,
    }));
    exportToExcel(formatted, `Stock_Inventory_${new Date().toISOString().split('T')[0]}.xlsx`, 'Stock Inventory');
  };

  const handleCsvExport = () => {
    exportToCSV(filtered, `stock_inventory_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-5">
      {/* Summary HUD Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-panel p-4">
          <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Catalog SKUs</div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">{stock.length} Styles</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active catalog variants</div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Stock on Hand</div>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-400 font-mono mt-1">{formatNumber(totalUnitsOnHand)} Units</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Usable physical inventory</div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Inventory Valuation</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            {formatCurrency(totalValuation)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Continuous WAC calculation</div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Low / Out of Stock</div>
          <div className={`text-xl sm:text-2xl font-extrabold font-mono mt-1 ${lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {lowStockCount} Styles
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Threshold &le; 5 units</div>
        </div>
      </div>

      {/* Top Filter & Export Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="relative w-full sm:w-64">
            <label htmlFor="stock-search-sku" className="sr-only">Search Style SKU</label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              id="stock-search-sku"
              name="stock_search_sku"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Style SKU..."
              style={{ paddingLeft: '2.5rem' }}
              className="input-field text-xs h-10 bg-slate-900/90 border-slate-700"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {['ALL', 'In Stock', 'Low Stock', 'Out of Stock', 'Over Sold'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={loadStock}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
            title="Refresh Stock"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
          <button onClick={handleExcelExport} className="btn btn-outline text-xs px-3.5 h-10 bg-slate-900/80 border-slate-700 hover:bg-slate-800">
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel (.xlsx)</span>
          </button>
          <button onClick={handleCsvExport} className="btn btn-outline text-xs px-3.5 h-10 bg-slate-900/80 border-slate-700 hover:bg-slate-800">
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Stock Matrix Table */}
      <div className="glass-panel overflow-hidden border border-slate-800 shadow-xl">
        <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/95 sticky top-0 z-20 text-slate-400 font-bold border-b border-slate-800 backdrop-blur-md">
              <tr>
                <th className="py-3.5 px-4 font-mono">Style No.</th>
                <th className="py-3.5 px-4 text-center">Purchased (Inflow)</th>
                <th className="py-3.5 px-4 text-center">Sold (Outflow)</th>
                <th className="py-3.5 px-4 text-center">Exchanged Out (Sent)</th>
                <th className="py-3.5 px-4 text-center">Restocked RTO 🚚</th>
                <th className="py-3.5 px-4 text-center">Restocked CR ↩️</th>
                <th className="py-3.5 px-4 text-center">Restocked Exch 🔄</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-white">Stock on Hand</th>
                <th className="py-3.5 px-4 text-right">Unit Cost ($)</th>
                <th className="py-3.5 px-4 text-right">Stock Valuation ($)</th>
                <th className="py-3.5 px-4 text-right">Total Revenue ($)</th>
                <th className="py-3.5 px-4 text-right">Total Profit ($)</th>
                <th className="py-3.5 px-4 text-center">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="13" className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading stock balance matrix...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="13" className="py-12 text-center text-slate-400">
                    No matching product styles found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.style_no} className="hover:bg-blue-500/[0.04] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white tracking-wide">
                      <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">
                        {item.style_no}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">{item.total_purchased}</td>
                    <td className="py-3.5 px-4 text-center font-mono">{item.total_sold}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-orange-400 font-semibold">{item.exch_out || 0}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-sky-400">{item.rto_restocked || 0}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-violet-400">{item.cr_restocked || 0}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-teal-400">{item.exch_restocked || 0}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-white text-sm">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        item.stock_on_hand > 5 ? 'text-emerald-300' : item.stock_on_hand > 0 ? 'text-amber-300' : 'text-rose-400'
                      }`}>
                        {item.stock_on_hand}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">{formatCurrency(item.unit_cost)}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100">
                      {formatCurrency(item.stock_valuation)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-blue-300">
                      {formatCurrency(item.total_revenue || 0)}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-mono font-bold ${
                      item.total_profit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {formatCurrency(item.total_profit)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filtered.length > 0 && (() => {
              const totalPurchased = filtered.reduce((s, i) => s + (i.total_purchased || 0), 0);
              const totalSold = filtered.reduce((s, i) => s + (i.total_sold || 0), 0);
              const totalExchOut = filtered.reduce((s, i) => s + (i.exch_out || 0), 0);
              const totalRtoRestocked = filtered.reduce((s, i) => s + (i.rto_restocked || 0), 0);
              const totalCrRestocked = filtered.reduce((s, i) => s + (i.cr_restocked || 0), 0);
              const totalExchRestocked = filtered.reduce((s, i) => s + (i.exch_restocked || 0), 0);
              const totalOnHand = filtered.reduce((s, i) => s + (i.stock_on_hand || 0), 0);
              const totalValuation = filtered.reduce((s, i) => s + (i.stock_valuation || 0), 0);
              const totalRevenue = filtered.reduce((s, i) => s + (i.total_revenue || 0), 0);
              const totalProfit = filtered.reduce((s, i) => s + (i.total_profit || 0), 0);

              return (
                <tfoot className="bg-slate-950 sticky bottom-0 z-20 border-t-2 border-slate-700 font-bold text-white">
                  <tr>
                    <td className="py-3.5 px-4 font-mono text-xs text-blue-400">TOTAL ({filtered.length} SKUs)</td>
                    <td className="py-3.5 px-4 text-center font-mono text-xs">{totalPurchased}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-xs">{totalSold}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-orange-400 text-xs">{totalExchOut}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-sky-400 text-xs">{totalRtoRestocked}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-violet-400 text-xs">{totalCrRestocked}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-teal-400 text-xs">{totalExchRestocked}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-indigo-300 text-sm">{totalOnHand}</td>
                    <td className="py-3.5 px-4 text-right text-slate-400 text-xs">-</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-xs">{formatCurrency(totalValuation)}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-300 text-xs">{formatCurrency(totalRevenue)}</td>
                    <td className={`py-3.5 px-4 text-right font-mono font-bold text-xs ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatCurrency(totalProfit)}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400 text-xs">-</td>
                  </tr>
                </tfoot>
              );
            })()}
          </table>
        </div>
      </div>
    </div>
  );
}
