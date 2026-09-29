import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Edit3,
  Layers,
  Sparkles,
  DollarSign,
  Package,
  Check,
  X,
  Eye,
  FileSpreadsheet,
  CheckCheck,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { api } from '../services/api';
import { exportToExcel } from '../utils/exportUtils';
import ProductFormModal from '../modals/ProductFormModal';
import ExcelImportModal from '../modals/ExcelImportModal';
import SortableHeader from '../components/SortableHeader';
import useTableControls from '../utils/useTableControls';

const MEESHO_CATALOG_COLUMNS = [
  { key: 'image_url', label: 'Photo', sortable: true, filterable: true, getValue: (p) => p.image_url ? 'Has Photo' : 'No Photo' },
  { key: 'style_no', label: 'Product / Style ID', sortable: true, filterable: true },
  { key: 'product_name', label: 'Product Name', sortable: true, filterable: true, getValue: (p) => p.product_name || 'Cotton Nighty for Women' },
  { key: 'sizing', label: 'Variation', sortable: true, filterable: true, getValue: (p) => p.sizing || 'XXL' },
  { key: 'meesho_price', label: 'Meesho Price', sortable: true, filterable: true, numeric: true },
  { key: 'wrong_return_price', label: 'Wrong Return', sortable: true, filterable: true, numeric: true, getValue: (p) => p.wrong_return_price ?? '' },
  { key: 'mrp_pcs', label: 'MRP', sortable: true, filterable: true, numeric: true },
  { key: 'gst_pct', label: 'GST %', sortable: true, filterable: true, numeric: true, getValue: (p) => p.gst_pct !== null && p.gst_pct !== undefined ? `${p.gst_pct}%` : '5%' },
  { key: 'hsn_id', label: 'HSN ID', sortable: true, filterable: true, getValue: (p) => p.hsn_id || '620821' },
  { key: 'net_weight_gms', label: 'Net Weight', sortable: true, filterable: true, numeric: true, getValue: (p) => p.net_weight_gms || 285 },
  { key: 'inventory', label: 'Inventory', sortable: true, filterable: true, numeric: true, getValue: (p) => p.inventory ?? p.stock_on_hand ?? 10 },
  { key: 'colour', label: 'Color', sortable: true, filterable: true },
  { key: 'country_of_origin', label: 'Country of Origin', sortable: true, filterable: true, getValue: (p) => p.country_of_origin || 'India' },
  { key: 'manufacturer_name', label: 'Manufacturer', sortable: true, filterable: true, getValue: (p) => p.manufacturer_name || 'Pegasus Creation' },
  { key: 'manufacturer_address', label: 'Mfg Address', sortable: true, filterable: true, getValue: (p) => p.manufacturer_address || 'Prasanta Apartment, Check Post' },
  { key: 'manufacturer_pincode', label: 'Mfg Pincode', sortable: true, filterable: true, getValue: (p) => p.manufacturer_pincode || '700125' },
  { key: 'packer_name', label: 'Packer Name', sortable: true, filterable: true, getValue: (p) => p.packer_name || 'Divine Enterprise' },
  { key: 'packer_address', label: 'Packer Address', sortable: true, filterable: true, getValue: (p) => p.packer_address || 'Prasanta Apartment, Check Post' },
  { key: 'packer_pincode', label: 'Packer Pincode', sortable: true, filterable: true, getValue: (p) => p.packer_pincode || '700125' },
  { key: 'importer_name', label: 'Importer', sortable: true, filterable: true, getValue: (p) => p.importer_name || '-' },
  { key: 'importer_address', label: 'Importer Address', sortable: true, filterable: true, getValue: (p) => p.importer_address || '-' },
  { key: 'importer_pincode', label: 'Importer Pincode', sortable: true, filterable: true, getValue: (p) => p.importer_pincode || '-' },
  { key: 'add_ons', label: 'Add Ons', sortable: true, filterable: true, getValue: (p) => p.add_ons || 'No Add Ons' },
  { key: 'fabric', label: 'Fabric', sortable: true, filterable: true, getValue: (p) => p.fabric || 'Cotton' },
  { key: 'fit_type', label: 'Fit/Type', sortable: true, filterable: true, getValue: (p) => p.fit_type || 'Dress' },
  { key: 'generic_name', label: 'Generic Name', sortable: true, filterable: true, getValue: (p) => p.generic_name || 'Maxi' },
  { key: 'net_quantity', label: 'Net Qty', sortable: true, filterable: true, getValue: (p) => p.net_quantity || '1' },
  { key: 'bust_size', label: 'Bust Size', sortable: true, filterable: true, numeric: true, getValue: (p) => p.bust_size || 42 },
  { key: 'length_size', label: 'Length Size', sortable: true, filterable: true, numeric: true, getValue: (p) => p.length_size || 54 },
  { key: 'image_url_2', label: 'Image 2', sortable: true, filterable: true, getValue: (p) => p.image_url_2 ? 'Has Image 2' : 'No Image' },
  { key: 'image_url_3', label: 'Image 3', sortable: true, filterable: true, getValue: (p) => p.image_url_3 ? 'Has Image 3' : 'No Image' },
  { key: 'image_url_4', label: 'Image 4', sortable: true, filterable: true, getValue: (p) => p.image_url_4 ? 'Has Image 4' : 'No Image' },
  { key: 'sku_id', label: 'SKU ID', sortable: true, filterable: true, getValue: (p) => p.sku_id || p.individual_barcode || '' },
  { key: 'brand_name', label: 'Brand Name', sortable: true, filterable: true, getValue: (p) => p.brand_name || '-' },
  { key: 'group_id', label: 'Group ID', sortable: true, filterable: true, getValue: (p) => p.group_id || '-' },
  { key: 'description', label: 'Description', sortable: true, filterable: true, getValue: (p) => p.description || '-' },
  { key: 'ean_upc', label: 'EAN/UPC', sortable: true, filterable: true, getValue: (p) => p.ean_upc || '-' },
  { key: 'brand', label: 'Brand', sortable: true, filterable: true, getValue: (p) => p.brand || '-' },
  { key: 'length', label: 'Length', sortable: true, filterable: true, getValue: (p) => p.length || 'Maxi' },
  { key: 'neck', label: 'Neck', sortable: true, filterable: true, getValue: (p) => p.neck || p.product_type || 'Square Neck' },
  { key: 'occasion', label: 'Occasion', sortable: true, filterable: true, getValue: (p) => p.occasion || 'Everyday' },
  { key: 'pattern', label: 'Pattern', sortable: true, filterable: true, getValue: (p) => p.pattern || 'Printed' },
  { key: 'pockets', label: 'Pockets', sortable: true, filterable: true, getValue: (p) => p.pockets || 'No Pocket' },
  { key: 'print_type', label: 'Print Type', sortable: true, filterable: true, getValue: (p) => p.print_type || 'Botanical' },
  { key: 'sleeve_length', label: 'Sleeve Length', sortable: true, filterable: true, getValue: (p) => p.sleeve_length || p.sub_category || 'Sleeveless' },
  { key: 'surface_styling', label: 'Surface Styling', sortable: true, filterable: true, getValue: (p) => p.surface_styling || 'Pleated Or Gathered' },
  { key: 'hip_size', label: 'Hip Size', sortable: true, filterable: true, numeric: true, getValue: (p) => p.hip_size || 44 },
  { key: 'waist_size', label: 'Waist Size', sortable: true, filterable: true, numeric: true, getValue: (p) => p.waist_size || 36 },
  { key: 'dimensions', label: 'Dimensions', sortable: true, filterable: true, getValue: (p) => `Bust ${p.bust_size || 42} • Len ${p.length_size || 54}` },
];

export default function MeeshoCatalogView() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedNeck, setSelectedNeck] = useState('');
  const [viewMode, setViewMode] = useState('table'); // Default to full table for exhaustive inspection
  const [meeshoTableMode, setMeeshoTableMode] = useState('full'); // 'full' (all 49 Meesho columns) | 'compact'

  // Modals
  const [previewImage, setPreviewImage] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

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
      setError(err.message || 'Failed to load Meesho catalog data');
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
      showToast('Successfully synchronized with Nightdress-10177-EXTERNAL-MeeshoTemplate2PricesGSTIN-Copy.xlsx');
      loadData();
    } catch (err) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // 1-Click Price Fix for DE26005 shortfall (-₹11)
  const handleFixDE26005 = async () => {
    try {
      const de26005Items = products.filter((p) => p.style_no.startsWith('DE26005'));
      for (const item of de26005Items) {
        await api.updateProduct(item.id, {
          meesho_price: 346,
          wrong_return_price: 324,
        });
      }
      showToast('Fixed DE26005 pricing across all 3 variants (₹335 → ₹346). Shortfall resolved!');
      loadData();
    } catch (err) {
      alert(`Failed to auto-fix: ${err.message}`);
    }
  };

  // Base search and dropdown filters
  const baseFilteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const matches =
          (p.style_no && p.style_no.toLowerCase().includes(q)) ||
          (p.individual_barcode && p.individual_barcode.toLowerCase().includes(q)) ||
          (p.colour && p.colour.toLowerCase().includes(q)) ||
          (p.product_type && p.product_type.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (selectedColor && p.colour !== selectedColor) return false;
      if (selectedNeck && p.product_type !== selectedNeck) return false;
      return true;
    });
  }, [products, search, selectedColor, selectedNeck]);

  // Enhanced Excel-style sorting and multi-column filtering
  const {
    sortConfig,
    columnFilters,
    requestSort,
    clearSort,
    getUniqueValues,
    getValueCounts,
    isFilterActive,
    toggleFilterValue,
    selectOnlyFilter,
    selectAllFilter,
    deselectAllFilter,
    clearFilter,
    clearAllFilters,
    activeFilterCount,
    processedData: filteredProducts,
  } = useTableControls({ data: baseFilteredProducts, columns: MEESHO_CATALOG_COLUMNS });

  const sharedHeaderProps = {
    sortConfig,
    columnFilters,
    onSort: requestSort,
    clearSort,
    getUniqueValues,
    getValueCounts,
    isFilterActive,
    onToggleFilter: toggleFilterValue,
    onSelectOnlyFilter: selectOnlyFilter,
    onSelectAll: selectAllFilter,
    onDeselectAll: deselectAllFilter,
    onClearFilter: clearFilter,
  };

  const handleDelete = async (item) => {
    const confirmMsg = `Are you sure you want to permanently delete SKU "${item.style_no}" (${item.colour || ''} - ${item.sizing || ''})?\n\nThis will also remove it from Barcode Master.xlsx and Meesho catalog workbooks.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await api.deleteProduct(item.id);
      showToast(`Deleted SKU ${item.style_no} successfully.`);
      window.dispatchEvent(new CustomEvent('divine-catalog-updated'));
      loadData();
    } catch (err) {
      alert(`Failed to delete SKU: ${err.message}`);
    }
  };

  // Reset page when search or filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedColor, selectedNeck, columnFilters, sortConfig]);

  const totalPages = useMemo(() => {
    if (pageSize === 'all') return 1;
    return Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  }, [filteredProducts.length, pageSize]);

  const paginatedProducts = useMemo(() => {
    if (pageSize === 'all') return filteredProducts;
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page, pageSize]);

  const neckTypes = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.product_type) set.add(p.product_type);
    });
    return Array.from(set).sort();
  }, [products]);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    setIsSaving(true);
    try {
      await api.updateProduct(editProduct.id, {
        meesho_price: parseFloat(editProduct.meesho_price),
        wrong_return_price: parseFloat(editProduct.wrong_return_price),
        mrp_pcs: parseFloat(editProduct.mrp_pcs),
        image_url: editProduct.image_url,
        image_url_2: editProduct.image_url_2,
        description: editProduct.description,
      });
      setEditProduct(null);
      showToast(`Saved changes for ${editProduct.style_no}`);
      loadData();
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 glass-panel px-4 py-3 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in bg-slate-900/95 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="glass-panel p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShoppingBag className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Meesho Marketplace Catalog
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {stats?.total_skus ?? products.length} SKUs • {stats?.image_readiness_pct ?? 100}% Photos Matched
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Marketplace Ingestion & Sync Layer: Images linked from <span className="font-mono text-emerald-300">Pic/</span> folder, Dual Returns Pricing, and 1-Click Excel Export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Add New SKU Form Button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn-primary text-xs flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add New SKU</span>
          </button>

          {/* Import / Upload Excel Workbook */}
          <button
            onClick={() => setIsImportOpen(true)}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Upload updated Excel to sync database"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Import / Sync Excel</span>
          </button>

          {/* Download Official Filled Meesho Upload Template */}
          <a
            href="/api/catalog/export/meesho"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export Meesho Sheet (.xlsx)</span>
          </a>

          <button
            onClick={handleSyncToExcel}
            disabled={isSyncing}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Sync live DB data back to template on disk"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync to Disk Files</span>
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
          <div className="glass-panel p-4 border border-emerald-500/30 bg-slate-900/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Image 1 (Front View)</span>
              <ImageIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-emerald-400 tracking-tight">
                {stats.has_image_count} / {stats.total_skus}
              </div>
              <span className="text-xs font-semibold text-emerald-300">
                ({stats.image_readiness_pct}% Ready)
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/80 mt-1 flex items-center gap-1">
              <CheckCheck className="w-3.5 h-3.5" />
              {stats.missing_images_count === 0
                ? 'All photos matched from Pic/ folder'
                : `${stats.missing_images_count} photos missing from Pic/ folder`}
            </p>
          </div>

          <div className="glass-panel p-4 border border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Avg Meesho Price</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-300 tracking-tight">₹{stats.avg_meesho_price}</div>
            <p className="text-[11px] text-slate-400 mt-1">Dual-Return Discount: -₹22 per unit</p>
          </div>

          <div className="glass-panel p-4 border border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Statutory Tax & HSN</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-300 tracking-tight">HSN 620821</div>
            <p className="text-[11px] text-slate-400 mt-1">GST Rate: 5% • Weight: 285g</p>
          </div>

          <div className="glass-panel p-4 border border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Margin Health Guard</span>
              <AlertTriangle className={`w-4 h-4 ${stats.pricing_anomalies_count > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-amber-300 tracking-tight">
                {stats.pricing_anomalies_count > 0 ? `${stats.pricing_anomalies_count} Shortfalls` : 'Verified'}
              </div>
              {stats.pricing_anomalies_count > 0 && (
                <button
                  onClick={handleFixDE26005}
                  className="px-2 py-1 text-[11px] font-bold rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                  title="Fix DE26005 from ₹335 to ₹346"
                >
                  Fix All (-₹11)
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {stats.pricing_anomalies_count > 0 ? 'Style DE26005 entered at ₹335 vs ₹346' : 'All margins verified'}
            </p>
          </div>
        </div>
      )}

      {/* Filter and View Mode Controls */}
      <div className="glass-panel p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Style, Color, Neck..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Colors ({stats?.unique_colors || 0})</option>
            {stats?.colors_list?.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedNeck}
            onChange={(e) => setSelectedNeck(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Neck Types</option>
            {neckTypes.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
              title="Clear all active column filters"
            >
              <span>Filters ({activeFilterCount})</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {viewMode === 'table' && (
            <div className="flex border border-slate-800 rounded-lg overflow-hidden p-0.5 bg-slate-950">
              <button
                onClick={() => setMeeshoTableMode('compact')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  meeshoTableMode === 'compact' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Compact
              </button>
              <button
                onClick={() => setMeeshoTableMode('full')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  meeshoTableMode === 'full' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All 49 Meesho Columns
              </button>
            </div>
          )}

          <div className="flex border border-slate-800 rounded-lg overflow-hidden p-0.5 bg-slate-950">
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'gallery' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gallery Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Listing Table
            </button>
          </div>

          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredProducts.length}</strong> of {products.length} Listings
          </span>
        </div>
      </div>

      {/* Main View: Gallery Grid or Table */}
      {viewMode === 'gallery' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((p) => (
            <div
              key={p.id}
              className="glass-panel overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between bg-slate-900/60 group"
            >
              <div>
                {/* Product Photo from Pic/ folder (Served via fast thumbnail) */}
                <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800">
                  {p.image_url ? (
                    <img
                      src={p.thumbnail_url || p.image_url}
                      alt={p.style_no}
                      loading="lazy"
                      decoding="async"
                      onClick={() => setPreviewImage(p.image_url)}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-600 gap-1">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-[11px]">No Photo Found</span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-900/80 backdrop-blur-md text-white border border-slate-700">
                      {p.style_no}
                    </span>
                    {p.has_price_anomaly && (
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-rose-500/90 text-white shadow">
                        Shortfall: ₹{p.meesho_price}
                      </span>
                    )}
                  </div>

                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded bg-slate-900/80 backdrop-blur-md text-emerald-300 border border-slate-700">
                    {p.colour}
                  </span>

                  {/* Thumbnail Previews overlay */}
                  {(p.image_url_2 || p.image_url_3) && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 p-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800">
                      {p.image_url_2 && (
                        <img
                          src={p.image_url_2}
                          alt="Back"
                          loading="lazy"
                          decoding="async"
                          onClick={() => setPreviewImage(p.image_url_2)}
                          className="w-6 h-8 object-cover rounded cursor-pointer hover:border border-emerald-400"
                        />
                      )}
                      {p.image_url_3 && (
                        <img
                          src={p.image_url_3}
                          alt="Detail"
                          loading="lazy"
                          decoding="async"
                          onClick={() => setPreviewImage(p.image_url_3)}
                          className="w-6 h-8 object-cover rounded cursor-pointer hover:border border-emerald-400"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{p.product_type}</span>
                    <span className="text-xs font-mono text-indigo-300 font-bold">{p.sizing}</span>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 space-y-1 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-400">Meesho Price:</span>
                      <span className="text-emerald-400 font-bold text-sm">₹{p.meesho_price}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Wrong Return Price:</span>
                      <span>₹{p.wrong_return_price}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>MRP:</span>
                      <span className="text-slate-300">₹{p.mrp_pcs}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                    <span>HSN: {p.hsn_id} (5% GST)</span>
                    <span className="font-semibold text-slate-300">{p.net_weight_gms}g</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3.5 pt-0 border-t border-slate-800/80 mt-1 flex items-center justify-between gap-2">
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> Image 1 Ready
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditProduct({ ...p })}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-xs"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 flex items-center gap-1 text-xs transition-colors"
                    title="Delete SKU from Catalog"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel overflow-hidden border border-slate-800 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <SortableHeader label="Photo" columnKey="image_url" sortable filterable align="center" {...sharedHeaderProps} />
                  <SortableHeader label="Product / Style ID" columnKey="style_no" sortable filterable {...sharedHeaderProps} />
                  <SortableHeader label="Product Name" columnKey="product_name" sortable filterable {...sharedHeaderProps} />
                  <SortableHeader label="Variation" columnKey="sizing" sortable filterable {...sharedHeaderProps} />
                  <SortableHeader label="Meesho Price" columnKey="meesho_price" sortable filterable align="right" {...sharedHeaderProps} />
                  <SortableHeader label="Wrong Return" columnKey="wrong_return_price" sortable filterable align="right" {...sharedHeaderProps} />
                  <SortableHeader label="MRP" columnKey="mrp_pcs" sortable filterable align="right" {...sharedHeaderProps} />
                  <SortableHeader label="GST %" columnKey="gst_pct" sortable filterable align="center" {...sharedHeaderProps} />
                  <SortableHeader label="HSN ID" columnKey="hsn_id" sortable filterable align="center" {...sharedHeaderProps} />
                  <SortableHeader label="Net Weight" columnKey="net_weight_gms" sortable filterable align="center" {...sharedHeaderProps} />
                  <SortableHeader label="Inventory" columnKey="inventory" sortable filterable align="center" {...sharedHeaderProps} />
                  <SortableHeader label="Color" columnKey="colour" sortable filterable {...sharedHeaderProps} />
                  {meeshoTableMode === 'full' && (
                    <>
                      <SortableHeader label="Country of Origin" columnKey="country_of_origin" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Manufacturer" columnKey="manufacturer_name" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Mfg Address" columnKey="manufacturer_address" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Mfg Pincode" columnKey="manufacturer_pincode" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Packer Name" columnKey="packer_name" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Packer Address" columnKey="packer_address" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Packer Pincode" columnKey="packer_pincode" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Importer" columnKey="importer_name" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Importer Address" columnKey="importer_address" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Importer Pincode" columnKey="importer_pincode" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Add Ons" columnKey="add_ons" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Fabric" columnKey="fabric" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Fit/Type" columnKey="fit_type" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Generic Name" columnKey="generic_name" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Net Qty" columnKey="net_quantity" sortable filterable align="center" {...sharedHeaderProps} />
                      <SortableHeader label="Bust Size" columnKey="bust_size" sortable filterable align="center" {...sharedHeaderProps} />
                      <SortableHeader label="Length Size" columnKey="length_size" sortable filterable align="center" {...sharedHeaderProps} />
                      <SortableHeader label="Image 2" columnKey="image_url_2" sortable filterable align="center" {...sharedHeaderProps} />
                      <SortableHeader label="Image 3" columnKey="image_url_3" sortable filterable align="center" {...sharedHeaderProps} />
                      <SortableHeader label="Image 4" columnKey="image_url_4" sortable filterable align="center" {...sharedHeaderProps} />
                      <SortableHeader label="SKU ID" columnKey="sku_id" sortable filterable className="font-mono" {...sharedHeaderProps} />
                      <SortableHeader label="Brand Name" columnKey="brand_name" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Group ID" columnKey="group_id" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Description" columnKey="description" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="EAN/UPC" columnKey="ean_upc" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Brand" columnKey="brand" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Length" columnKey="length" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Neck" columnKey="neck" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Occasion" columnKey="occasion" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Pattern" columnKey="pattern" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Pockets" columnKey="pockets" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Print Type" columnKey="print_type" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Sleeve Length" columnKey="sleeve_length" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Surface Styling" columnKey="surface_styling" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Hip Size" columnKey="hip_size" sortable filterable align="center" {...sharedHeaderProps} />
                      <SortableHeader label="Waist Size" columnKey="waist_size" sortable filterable align="center" {...sharedHeaderProps} />
                    </>
                  )}
                  {meeshoTableMode === 'compact' && (
                    <>
                      <SortableHeader label="Neck" columnKey="neck" sortable filterable {...sharedHeaderProps} />
                      <SortableHeader label="Dimensions" columnKey="dimensions" sortable filterable align="center" {...sharedHeaderProps} />
                      <SortableHeader label="SKU ID" columnKey="sku_id" sortable filterable className="font-mono" {...sharedHeaderProps} />
                    </>
                  )}
                  <th className="py-3 px-3 text-center sticky right-0 bg-slate-950/90 backdrop-blur-md">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* 1. Photo */}
                    <td className="py-2 px-3">
                      {p.image_url ? (
                        <img
                          src={p.thumbnail_url || p.image_url}
                          alt={p.style_no}
                          loading="lazy"
                          decoding="async"
                          onClick={() => setPreviewImage(p.image_url)}
                          className="w-9 h-12 object-cover rounded cursor-pointer border border-slate-700 hover:border-emerald-400"
                        />
                      ) : (
                        <div className="w-9 h-12 rounded bg-slate-950 flex items-center justify-center text-slate-600">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </td>

                    {/* 2. Style No / ID */}
                    <td className="py-2.5 px-3 font-bold text-white font-mono">{p.style_no}</td>

                    {/* 3. Product Name */}
                    <td className="py-2.5 px-3 text-slate-200 max-w-[200px] truncate" title={p.product_name}>
                      {p.product_name || 'Cotton Nighty for Women'}
                    </td>

                    {/* 4. Variation */}
                    <td className="py-2.5 px-3 text-indigo-300 font-mono font-semibold">{p.sizing || 'XXL'}</td>

                    {/* 5. Meesho Price */}
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">₹{p.meesho_price}</td>

                    {/* 6. Wrong Return Price */}
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {p.wrong_return_price ? `₹${p.wrong_return_price}` : '-'}
                    </td>

                    {/* 7. MRP */}
                    <td className="py-2.5 px-3 text-right text-slate-200">₹{p.mrp_pcs}</td>

                    {/* 8. GST % */}
                    <td className="py-2.5 px-3 text-center text-slate-300">
                      {p.gst_pct !== null && p.gst_pct !== undefined ? `${p.gst_pct}%` : '5%'}
                    </td>

                    {/* 9. HSN ID */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400">{p.hsn_id || '620821'}</td>

                    {/* 10. Net Weight */}
                    <td className="py-2.5 px-3 text-center text-slate-300">{p.net_weight_gms || 285}g</td>

                    {/* 11. Inventory */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {p.inventory ?? p.stock_on_hand ?? 10}
                      </span>
                    </td>

                    {/* 12. Color */}
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full border border-slate-700 bg-slate-400" />
                        <span className="text-slate-200">{p.colour}</span>
                      </span>
                    </td>

                    {meeshoTableMode === 'full' && (
                      <>
                        {/* 13. Country of Origin */}
                        <td className="py-2.5 px-3 text-slate-400">{p.country_of_origin || 'India'}</td>

                        {/* 14-16. Manufacturer */}
                        <td className="py-2.5 px-3 text-slate-300">{p.manufacturer_name || 'Pegasus Creation'}</td>
                        <td className="py-2.5 px-3 text-slate-400 max-w-[160px] truncate" title={p.manufacturer_address}>
                          {p.manufacturer_address || 'Prasanta Apartment, Check Post'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{p.manufacturer_pincode || '700125'}</td>

                        {/* 17-19. Packer */}
                        <td className="py-2.5 px-3 text-slate-300">{p.packer_name || 'Divine Enterprise'}</td>
                        <td className="py-2.5 px-3 text-slate-400 max-w-[160px] truncate" title={p.packer_address}>
                          {p.packer_address || 'Prasanta Apartment, Check Post'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{p.packer_pincode || '700125'}</td>

                        {/* 20-22. Importer */}
                        <td className="py-2.5 px-3 text-slate-400">{p.importer_name || '-'}</td>
                        <td className="py-2.5 px-3 text-slate-400 max-w-[140px] truncate">{p.importer_address || '-'}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{p.importer_pincode || '-'}</td>

                        {/* 23. Add Ons */}
                        <td className="py-2.5 px-3 text-slate-400">{p.add_ons || 'No Add Ons'}</td>

                        {/* 24. Fabric */}
                        <td className="py-2.5 px-3 text-slate-300">{p.fabric || 'Cotton'}</td>

                        {/* 25. Fit/Type */}
                        <td className="py-2.5 px-3 text-slate-300">{p.fit_type || 'Dress'}</td>

                        {/* 26. Generic Name */}
                        <td className="py-2.5 px-3 text-slate-300">{p.generic_name || 'Maxi'}</td>

                        {/* 27. Net Qty */}
                        <td className="py-2.5 px-3 text-center text-slate-300">{p.net_quantity || '1'}</td>

                        {/* 28. Bust Size */}
                        <td className="py-2.5 px-3 text-center text-indigo-300 font-mono">{p.bust_size || '42'}</td>

                        {/* 29. Length Size */}
                        <td className="py-2.5 px-3 text-center text-indigo-300 font-mono">{p.length_size || '54'}</td>

                        {/* 30-32. Images 2, 3, 4 */}
                        <td className="py-2.5 px-3 text-center">
                          {p.image_url_2 ? (
                            <img
                              src={p.image_url_2}
                              alt="img2"
                              onClick={() => setPreviewImage(p.image_url_2)}
                              className="w-7 h-9 object-cover rounded cursor-pointer border border-slate-700 mx-auto"
                            />
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {p.image_url_3 ? (
                            <img
                              src={p.image_url_3}
                              alt="img3"
                              onClick={() => setPreviewImage(p.image_url_3)}
                              className="w-7 h-9 object-cover rounded cursor-pointer border border-slate-700 mx-auto"
                            />
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {p.image_url_4 ? (
                            <img
                              src={p.image_url_4}
                              alt="img4"
                              onClick={() => setPreviewImage(p.image_url_4)}
                              className="w-7 h-9 object-cover rounded cursor-pointer border border-slate-700 mx-auto"
                            />
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>

                        {/* 33. SKU ID */}
                        <td className="py-2.5 px-3 font-mono text-indigo-300">{p.sku_id || p.individual_barcode}</td>

                        {/* 34. Brand Name */}
                        <td className="py-2.5 px-3 text-slate-400">{p.brand_name || '-'}</td>

                        {/* 35. Group ID */}
                        <td className="py-2.5 px-3 text-slate-400">{p.group_id || '-'}</td>

                        {/* 36. Description */}
                        <td className="py-2.5 px-3 text-slate-400 max-w-[200px] truncate" title={p.description}>
                          {p.description || '-'}
                        </td>

                        {/* 37. EAN/UPC */}
                        <td className="py-2.5 px-3 font-mono text-slate-400">{p.ean_upc || '-'}</td>

                        {/* 38. Brand */}
                        <td className="py-2.5 px-3 text-slate-400">{p.brand || '-'}</td>

                        {/* 39. Length */}
                        <td className="py-2.5 px-3 text-slate-300">{p.length || 'Maxi'}</td>

                        {/* 40. Neck */}
                        <td className="py-2.5 px-3 text-slate-300">{p.neck || p.product_type || 'Square Neck'}</td>

                        {/* 41. Occasion */}
                        <td className="py-2.5 px-3 text-slate-400">{p.occasion || 'Everyday'}</td>

                        {/* 42. Pattern */}
                        <td className="py-2.5 px-3 text-slate-400">{p.pattern || 'Printed'}</td>

                        {/* 43. Pockets */}
                        <td className="py-2.5 px-3 text-slate-400">{p.pockets || 'No Pocket'}</td>

                        {/* 44. Print Type */}
                        <td className="py-2.5 px-3 text-slate-400">{p.print_type || 'Botanical'}</td>

                        {/* 45. Sleeve Length */}
                        <td className="py-2.5 px-3 text-slate-400">{p.sleeve_length || p.sub_category || 'Sleeveless'}</td>

                        {/* 46. Surface Styling */}
                        <td className="py-2.5 px-3 text-slate-400">{p.surface_styling || 'Pleated Or Gathered'}</td>

                        {/* 47. Hip Size */}
                        <td className="py-2.5 px-3 text-center text-slate-300 font-mono">{p.hip_size || '44'}</td>

                        {/* 48. Waist Size */}
                        <td className="py-2.5 px-3 text-center text-slate-300 font-mono">{p.waist_size || '36'}</td>
                      </>
                    )}

                    {meeshoTableMode === 'compact' && (
                      <>
                        <td className="py-2.5 px-3 text-slate-300">{p.neck || p.product_type}</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">
                          Bust {p.bust_size || 42} • Len {p.length_size || 54}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-indigo-300">{p.sku_id || p.individual_barcode}</td>
                      </>
                    )}

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-center sticky right-0 bg-slate-950/90 backdrop-blur-md">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditProduct({ ...p })}
                          className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                          title="Edit Listing Attributes"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-1 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete SKU from Catalog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* High-Speed Pagination Bar */}
      <div className="glass-panel p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs bg-slate-900/60 rounded-xl">
        <div className="text-slate-400 flex items-center gap-2">
          <span>
            Showing <strong className="text-white">{filteredProducts.length === 0 ? 0 : (page - 1) * (pageSize === 'all' ? filteredProducts.length : pageSize) + 1}</strong> to{' '}
            <strong className="text-white">
              {pageSize === 'all' ? filteredProducts.length : Math.min(page * pageSize, filteredProducts.length)}
            </strong> of <strong className="text-emerald-400">{filteredProducts.length}</strong> products
          </span>
          <span className="text-slate-600">|</span>
          <label className="flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10);
                setPageSize(val);
                setPage(1);
              }}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value="all">All ({filteredProducts.length})</option>
            </select>
          </label>
        </div>

        {pageSize !== 'all' && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <span className="px-3 py-1 rounded bg-slate-950 text-slate-300 font-mono">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Full Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-xl max-h-[85vh] p-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewImage} alt="Preview" className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto" />
          </div>
        </div>
      )}

      {/* Product Form Modal (for Add and Edit) */}
      <ProductFormModal
        isOpen={isCreateOpen || Boolean(editProduct)}
        initialData={editProduct}
        onClose={() => {
          setIsCreateOpen(false);
          setEditProduct(null);
        }}
        onSuccess={() => {
          showToast(editProduct ? 'Updated product successfully!' : 'Created new product SKU successfully!');
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
    </div>
  );
}
