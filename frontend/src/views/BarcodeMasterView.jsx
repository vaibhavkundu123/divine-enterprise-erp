import React, { useState, useEffect, useMemo } from 'react';
import {
  Barcode,
  Search,
  Filter,
  Download,
  Printer,
  RefreshCw,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Layers,
  Copy,
  Check,
  X,
  DollarSign,
  Package,
  FileSpreadsheet,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import { exportToExcel } from '../utils/exportUtils';
import ProductFormModal from '../modals/ProductFormModal';
import ExcelImportModal from '../modals/ExcelImportModal';


export default function BarcodeMasterView() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedNeck, setSelectedNeck] = useState('');
  const [tableMode, setTableMode] = useState('full'); // 'full' (all 20 Barcode Master cols) or 'compact'

  // Barcode Scanner Station state
  const [scanInput, setScanInput] = useState('');
  const [scannedItem, setScannedItem] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [copiedBarcode, setCopiedBarcode] = useState(null);

  // Print Label Modal
  const [printModalItem, setPrintModalItem] = useState(null);
  const [labelQty, setLabelQty] = useState(1);

  // Edit & Create Modals
  const [editItem, setEditItem] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodData, statData] = await Promise.all([
        api.getCatalog(),
        api.getCatalogStats(),
      ]);
      setProducts(prodData || []);
      setStats(statData || null);
    } catch (err) {
      setError(err.message || 'Failed to load barcode master data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncToExcel = async () => {
    setIsSyncing(true);
    try {
      await api.triggerSync();
      showToast('Successfully synchronized data with Barcode Master.xlsx on disk.');
      loadData();
    } catch (err) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const matches =
          (p.style_no && p.style_no.toLowerCase().includes(q)) ||
          (p.individual_barcode && p.individual_barcode.toLowerCase().includes(q)) ||
          (p.pack_barcode && p.pack_barcode.toLowerCase().includes(q)) ||
          (p.colour && p.colour.toLowerCase().includes(q)) ||
          (p.product_type && p.product_type.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (selectedColor && p.colour !== selectedColor) return false;
      if (selectedNeck && p.product_type !== selectedNeck) return false;
      return true;
    });
  }, [products, search, selectedColor, selectedNeck]);

  const neckTypes = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.product_type) set.add(p.product_type);
    });
    return Array.from(set).sort();
  }, [products]);

  const handleScanLookup = async (codeToLookup) => {
    const code = (codeToLookup || scanInput).trim();
    if (!code) return;
    setIsScanning(true);
    setScanError(null);
    try {
      const res = await api.lookupBarcode(code);
      setScannedItem(res);
      setScanInput('');
    } catch (err) {
      setScanError(err.message || `No SKU matched barcode: ${code}`);
      setScannedItem(null);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedBarcode(code);
    setTimeout(() => setCopiedBarcode(null), 2000);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!editItem) return;
    setIsSaving(true);
    try {
      await api.updateProduct(editItem.id, {
        purchase_rate: parseFloat(editItem.purchase_rate),
        profit_margin: parseFloat(editItem.profit_margin),
        meesho_price: parseFloat(editItem.meesho_price),
        mrp_pcs: parseFloat(editItem.mrp_pcs),
      });
      setEditItem(null);
      showToast(`Updated pricing for ${editItem.style_no}`);
      loadData();
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredProducts.map((p) => ({
      'SL No': p.sl_no,
      'Season': p.season,
      'Style No': p.style_no,
      'Category': p.category,
      'Sub Category': p.sub_category,
      'Product Neck': p.product_type,
      'Fabric Composition': p.fabric_composition,
      'Colour': p.colour,
      'Sizing': p.sizing,
      'Individual Barcode': p.individual_barcode,
      'Pack of Barcode': p.pack_barcode,
      'Purchase Rate': p.purchase_rate,
      'Profit Margin': `${(p.profit_margin * 100).toFixed(0)}%`,
      'Meesho Price': p.meesho_price,
      'MRP (pcs)': p.mrp_pcs,
      'MRP (set)': p.mrp_set,
      'Stock On Hand': p.stock_on_hand,
    }));
    exportToExcel(exportData, `Barcode_Master_${new Date().toISOString().split('T')[0]}.xlsx`, 'BARCODE');
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 glass-panel px-4 py-3 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in bg-slate-900/95 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="glass-panel p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Barcode className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Barcode Master & SKU Engine
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Barcode Master.xlsx Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Internal Master Engine: 41 Cotton Nighty SKUs, 14-char Barcode Generation, Sizing & Unit Economics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Add New SKU Form Button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn-primary text-xs flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add New SKU</span>
          </button>

          {/* Import / Upload Excel Workbook */}
          <button
            onClick={() => setIsImportOpen(true)}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Upload updated Excel workbook"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Import Excel</span>
          </button>

          {/* Download Official Barcode Master File */}
          <a
            href="/api/catalog/export/barcode-master"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Download Barcode Master.xlsx populated with live data"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Download Master (.xlsx)</span>
          </a>

          <button
            onClick={handleSyncToExcel}
            disabled={isSyncing}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Sync live database back to Barcode Master.xlsx on disk"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync to Disk</span>
          </button>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="glass-panel p-4 border border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Total SKUs</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">{stats.total_skus}</div>
            <p className="text-[11px] text-slate-400 mt-1">100% Barcode Coverage (1:1)</p>
          </div>

          <div className="glass-panel p-4 border border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Colors Registered</span>
              <Tag className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-bold text-pink-300 tracking-tight">{stats.unique_colors}</div>
            <p className="text-[11px] text-slate-400 mt-1">Black, Maroon, Red, Gold, Green...</p>
          </div>

          <div className="glass-panel p-4 border border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Avg Landed Cost</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-300 tracking-tight">₹{stats.avg_purchase_rate}</div>
            <p className="text-[11px] text-slate-400 mt-1">Purchase Range: ₹210 - ₹240</p>
          </div>

          <div className="glass-panel p-4 border border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Default Sizing</span>
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-300 tracking-tight">XXL</div>
            <p className="text-[11px] text-slate-400 mt-1">Code: 13 • 1 Component per pack</p>
          </div>
        </div>
      )}

      {/* Barcode Quick Scanner & Station */}
      <div className="glass-panel p-4 sm:p-5 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-slate-900/80 to-slate-900/90 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Barcode className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                Barcode Station & Label Studio
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Ready for Scanner
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Scan with handheld scanner or click sample barcode (e.g.{' '}
                <span className="font-mono text-indigo-300 cursor-pointer hover:underline" onClick={() => handleScanLookup('DE26030B103313')}>
                  DE26030B103313
                </span>{' '}
                or pack{' '}
                <span className="font-mono text-indigo-300 cursor-pointer hover:underline" onClick={() => handleScanLookup('PDE26030B103313')}>
                  PDE26030B103313
                </span>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScanLookup()}
                placeholder="Scan barcode or type code..."
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 border border-indigo-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>
            <button
              onClick={() => handleScanLookup()}
              disabled={isScanning || !scanInput.trim()}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50"
            >
              Lookup
            </button>
          </div>
        </div>

        {/* Scanned Card Popup */}
        {scannedItem && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-scale-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-lg font-bold">
                ✓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white font-mono">{scannedItem.style_no}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300">
                    {scannedItem.colour}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300">
                    {scannedItem.sizing}
                  </span>
                  {scannedItem.is_pack_barcode && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Pack Barcode
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Individual: {scannedItem.individual_barcode} • Pack: {scannedItem.pack_barcode}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-right">
              <div>
                <div className="text-[11px] text-slate-400">Stock on Hand</div>
                <div className="text-base font-bold text-white">{scannedItem.stock_on_hand} pcs</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Landed Cost</div>
                <div className="text-base font-bold text-amber-300">₹{scannedItem.purchase_rate}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">MRP</div>
                <div className="text-base font-bold text-slate-200">₹{scannedItem.mrp_pcs}</div>
              </div>
              <button
                onClick={() => {
                  setPrintModalItem(scannedItem);
                  setLabelQty(1);
                }}
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Tag</span>
              </button>
              <button onClick={() => setScannedItem(null)} className="text-slate-500 hover:text-slate-300 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {scanError && (
          <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {scanError}
            </span>
            <button onClick={() => setScanError(null)} className="text-rose-400 hover:text-rose-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Style, Barcode, Color..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Colors ({stats?.unique_colors || 0})</option>
            {stats?.colors_list?.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedNeck}
            onChange={(e) => setSelectedNeck(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Neck Types</option>
            {neckTypes.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex border border-slate-800 rounded-lg overflow-hidden p-0.5 bg-slate-950">
            <button
              onClick={() => setTableMode('compact')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                tableMode === 'compact' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Compact
            </button>
            <button
              onClick={() => setTableMode('full')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                tableMode === 'full' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All 20 Barcode Master Columns
            </button>
          </div>
          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredProducts.length}</strong> of {products.length} Rows
          </div>
        </div>
      </div>

      {/* Barcode Master Table */}
      <div className="glass-panel overflow-hidden border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-3">SL No.</th>
                {tableMode === 'full' && <th className="py-3 px-3">Season</th>}
                <th className="py-3 px-3">Style No.</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Sub Category</th>
                <th className="py-3 px-3">Product (Neck)</th>
                {tableMode === 'full' && <th className="py-3 px-3">Sub Product</th>}
                {tableMode === 'full' && <th className="py-3 px-3">Fabric Comp.</th>}
                {tableMode === 'full' && <th className="py-3 px-3">Fabric Type</th>}
                {tableMode === 'full' && <th className="py-3 px-3 text-center">Components</th>}
                <th className="py-3 px-3">Colour</th>
                <th className="py-3 px-3">Sizing</th>
                {tableMode === 'full' && <th className="py-3 px-3 text-center">Size / Set</th>}
                <th className="py-3 px-3 font-mono">Individual Barcode</th>
                <th className="py-3 px-3 text-right">Purchase Rate</th>
                <th className="py-3 px-3 text-right">Profit %</th>
                <th className="py-3 px-3 text-right">Meesho Price</th>
                <th className="py-3 px-3 text-right">MRP (pcs)</th>
                {tableMode === 'full' && <th className="py-3 px-3 text-right">MRP (set)</th>}
                <th className="py-3 px-3 font-mono">Pack Barcode</th>
                <th className="py-3 px-3 text-center">Stock</th>
                <th className="py-3 px-3 text-center sticky right-0 bg-slate-950/90 backdrop-blur-md">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 text-slate-500">{p.sl_no || idx + 1}</td>
                  {tableMode === 'full' && (
                    <td className="py-2.5 px-3 text-slate-400">{p.season || 'Everyday'}</td>
                  )}
                  <td className="py-2.5 px-3 font-bold text-white font-mono">{p.style_no}</td>
                  <td className="py-2.5 px-3 text-slate-300">{p.category}</td>
                  <td className="py-2.5 px-3 text-slate-400">{p.sub_category}</td>
                  <td className="py-2.5 px-3 text-slate-300">{p.product_type}</td>
                  {tableMode === 'full' && (
                    <td className="py-2.5 px-3 text-slate-400">{p.sub_product || 'SINGLE DRESS'}</td>
                  )}
                  {tableMode === 'full' && (
                    <td className="py-2.5 px-3 text-slate-300">{p.fabric_composition || 'Woven'}</td>
                  )}
                  {tableMode === 'full' && (
                    <td className="py-2.5 px-3 text-slate-400">{p.fabric_type || 'Woven'}</td>
                  )}
                  {tableMode === 'full' && (
                    <td className="py-2.5 px-3 text-center text-slate-300">{p.no_of_components || 1}</td>
                  )}
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-700 bg-slate-400" />
                      <span className="text-slate-200">{p.colour}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-300">{p.sizing}</td>
                  {tableMode === 'full' && (
                    <td className="py-2.5 px-3 text-center text-slate-300">{p.num_size_per_set || 1}</td>
                  )}
                  <td className="py-2.5 px-3 font-mono text-indigo-300">
                    <button
                      onClick={() => handleCopy(p.individual_barcode)}
                      className="hover:underline inline-flex items-center gap-1"
                      title="Click to copy barcode"
                    >
                      <span>{p.individual_barcode}</span>
                      {copiedBarcode === p.individual_barcode ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-500 hover:text-slate-300" />
                      )}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-300">₹{p.purchase_rate}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">
                    {(p.profit_margin * 100).toFixed(0)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                    ₹{p.meesho_price}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-200">
                    ₹{p.mrp_pcs}
                  </td>
                  {tableMode === 'full' && (
                    <td className="py-2.5 px-3 text-right text-slate-300">₹{p.mrp_set || p.mrp_pcs}</td>
                  )}
                  <td className="py-2.5 px-3 font-mono text-purple-300 text-[11px]">{p.pack_barcode}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                      {p.stock_on_hand}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center sticky right-0 bg-slate-900/90 backdrop-blur-md">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setEditItem({ ...p })}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                        title="Edit Costing & Price"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setPrintModalItem(p);
                          setLabelQty(1);
                        }}
                        className="p-1 rounded hover:bg-slate-700 text-indigo-400 hover:text-indigo-200"
                        title="Print Hangtag"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal (for Add and Edit) */}
      <ProductFormModal
        isOpen={isCreateOpen || Boolean(editItem)}
        initialData={editItem}
        onClose={() => {
          setIsCreateOpen(false);
          setEditItem(null);
        }}
        onSuccess={() => {
          showToast(editItem ? 'Updated product successfully!' : 'Created new product SKU successfully!');
          loadData();
        }}
      />

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={(result) => {
          showToast(`Successfully imported ${result.imported_count} products from Excel workbook!`);
          loadData();
        }}
      />

      {/* Printable Thermal Label Modal */}
      {printModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md border border-slate-700 bg-slate-900 p-6 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-indigo-400" />
                Thermal Tag Preview (50mm × 25mm)
              </h3>
              <button onClick={() => setPrintModalItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white text-black rounded-lg border-2 border-slate-300 shadow-md font-sans text-center my-4">
              <div className="text-[12px] font-extrabold uppercase tracking-wide">DIVINE ENTERPRISE</div>
              <div className="text-[10px] font-semibold text-slate-700">COTTON NIGHTY (MAXI)</div>
              <div className="flex justify-between items-center px-4 my-1 text-[11px] font-bold">
                <span>STYLE: {printModalItem.style_no}</span>
                <span>SIZE: {printModalItem.sizing}</span>
              </div>
              <div className="flex justify-between items-center px-4 text-[10px]">
                <span>COLOR: {printModalItem.colour}</span>
                <span>MRP: ₹{printModalItem.mrp_pcs}.00</span>
              </div>

              {/* Simulated barcode */}
              <div className="my-2 h-10 flex items-center justify-center gap-0.5">
                {printModalItem.individual_barcode.split('').map((char, i) => (
                  <div
                    key={i}
                    className={`h-full ${char.charCodeAt(0) % 2 === 0 ? 'w-1 bg-black' : 'w-0.5 bg-black'}`}
                  />
                ))}
              </div>
              <div className="font-mono text-[11px] tracking-wider font-bold">
                {printModalItem.individual_barcode}
              </div>
              <div className="text-[8px] text-slate-500 mt-1">MFG: PEGASUS CREATION • 100% COTTON</div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Labels:</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={labelQty}
                  onChange={(e) => setLabelQty(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-center text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPrintModalItem(null)} className="btn-secondary text-xs">
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-primary text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Tag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
