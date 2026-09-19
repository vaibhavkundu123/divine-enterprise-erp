import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, DollarSign, Check, AlertCircle, Percent } from 'lucide-react';
import { api } from '../services/api';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function GlobalRecordSaleModal({ isOpen, onClose, onSuccess, styleCatalog = [] }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [styleNo, setStyleNo] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [sellingPrice, setSellingPrice] = useState('');
  const [totalRevenue, setTotalRevenue] = useState('');
  const [reference, setReference] = useState('Sale');

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selected style metadata
  const selectedStyle = styleCatalog.find((s) => s.style_no.toLowerCase() === styleNo.toLowerCase());

  // Quick Markup handler
  const handleMarkup = (pct) => {
    if (!selectedStyle || !selectedStyle.unit_cost) return;
    const cost = selectedStyle.unit_cost;
    const price = Math.round(cost * (1 + pct / 100) * 100) / 100;
    setSellingPrice(price.toString());
    const q = parseInt(quantity, 10) || 1;
    setTotalRevenue((price * q).toFixed(2));
  };

  // Synchronize price & revenue
  const handlePriceChange = (val) => {
    setSellingPrice(val);
    const num = parseFloat(val);
    const q = parseInt(quantity, 10);
    if (!isNaN(num) && num > 0 && !isNaN(q) && q > 0) {
      setTotalRevenue((num * q).toFixed(2));
    }
  };

  const handleRevenueChange = (val) => {
    setTotalRevenue(val);
    const num = parseFloat(val);
    const q = parseInt(quantity, 10);
    if (!isNaN(num) && num > 0 && !isNaN(q) && q > 0) {
      setSellingPrice((num / q).toFixed(2));
    }
  };

  const handleQuantityChange = (val) => {
    setQuantity(val);
    const q = parseInt(val, 10);
    const p = parseFloat(sellingPrice);
    if (!isNaN(q) && q > 0 && !isNaN(p) && p > 0) {
      setTotalRevenue((p * q).toFixed(2));
    }
  };

  // Fetch live preview
  useEffect(() => {
    if (!styleNo) {
      setPreview(null);
      return;
    }
    const q = parseInt(quantity, 10) || 1;
    const p = parseFloat(sellingPrice);
    const r = parseFloat(totalRevenue);

    if ((p > 0 || r > 0) && styleNo) {
      api.previewSale({
        style_no: styleNo,
        quantity_sold: q,
        selling_price: p > 0 ? p : undefined,
        total_revenue: r > 0 ? r : undefined,
      })
        .then((data) => setPreview(data))
        .catch(() => {});
    }
  }, [styleNo, quantity, sellingPrice, totalRevenue]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!styleNo) {
      setError('Please select or enter a Product Style No.');
      return;
    }
    const q = parseInt(quantity, 10);
    if (isNaN(q) || q < 1) {
      setError('Please enter a valid quantity of at least 1.');
      return;
    }
    const p = parseFloat(sellingPrice);
    const r = parseFloat(totalRevenue);
    if (!p && !r) {
      setError('Please enter either Unit Selling Price or Total Revenue.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const createdSale = await api.createSale({
        date,
        style_no: styleNo.trim(),
        quantity_sold: q,
        selling_price: p > 0 ? p : undefined,
        total_revenue: r > 0 ? r : undefined,
        reference: reference || 'Sale',
      });
      onSuccess && onSuccess(createdSale);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record sales order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-6 border border-slate-700 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Record Dispatched Sale</h2>
              <p className="text-xs text-slate-400">Order Intake with Instant COGS & Margin Calculation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sale-modal-date" className="block text-xs font-semibold text-slate-300 mb-1">Dispatch Date</label>
              <input
                id="sale-modal-date"
                name="sale_date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="sale-modal-quantity" className="block text-xs font-semibold text-slate-300 mb-1">Quantity Sold</label>
              <input
                id="sale-modal-quantity"
                name="sale_quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                onBlur={() => {
                  if (!quantity || parseInt(quantity, 10) < 1) {
                    handleQuantityChange('1');
                  }
                }}
                required
                className="input-field"
              />
            </div>
          </div>

          {/* Style Autocomplete Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="sale-modal-style" className="block text-xs font-semibold text-slate-300">Style SKU</label>
              {selectedStyle && (
                <span className="text-[11px] text-slate-400">
                  Stock: <strong className="text-white">{selectedStyle.stock_on_hand}</strong> units | WAC: {formatCurrency(selectedStyle.unit_cost)}
                </span>
              )}
            </div>
            <input
              id="sale-modal-style"
              name="sale_style_no"
              type="text"
              list="style-options"
              value={styleNo}
              onChange={(e) => setStyleNo(e.target.value)}
              placeholder="e.g. DE26001G"
              required
              className="input-field uppercase"
            />
            <datalist id="style-options">
              {styleCatalog.map((s) => (
                <option key={s.style_no} value={s.style_no}>
                  {s.style_no} - Stock: {s.stock_on_hand} (WAC: {formatCurrency(s.unit_cost)})
                </option>
              ))}
            </datalist>
          </div>

          {/* Quick Dynamic Price Markup Chips */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5 text-xs text-slate-400">
              <Percent className="w-3.5 h-3.5 text-blue-400" />
              <span>Quick Dynamic Pricing Markups (over WAC cost):</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[25, 35, 50, 75].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleMarkup(pct)}
                  disabled={!selectedStyle}
                  className="px-2 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 border border-slate-700 hover:border-blue-500/40 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  +{pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Dual-Input Pricing Matrix */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sale-modal-unit-price" className="block text-xs font-semibold text-slate-300 mb-1">Selling Price ($)</label>
              <input
                id="sale-modal-unit-price"
                name="sale_selling_price"
                type="number"
                step="0.01"
                min="0"
                value={sellingPrice}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="Per unit rate"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="sale-modal-total-rev" className="block text-xs font-semibold text-slate-300 mb-1">Total Revenue ($)</label>
              <input
                id="sale-modal-total-rev"
                name="sale_total_revenue"
                type="number"
                step="0.01"
                min="0"
                value={totalRevenue}
                onChange={(e) => handleRevenueChange(e.target.value)}
                placeholder="Full invoice"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="sale-modal-reference" className="block text-xs font-semibold text-slate-300 mb-1">Order Reference / Channel</label>
            <input
              id="sale-modal-reference"
              name="sale_reference"
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. Sale, Shopify #1042"
              className="input-field"
            />
          </div>

          {/* Real-Time Financial Preview Box */}
          {preview && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-500/40 text-xs space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between font-bold text-white pb-1.5 border-b border-slate-800">
                <span>Calculated Real-Time Margin</span>
                <span className={preview.profit >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {formatPercent(preview.profit_margin)} Margin
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-slate-300">
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Revenue</span>
                  <span className="font-semibold text-white font-mono">{formatCurrency(preview.total_revenue)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">COGS ({quantity}x)</span>
                  <span className="font-semibold text-white font-mono">{formatCurrency(preview.cogs)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Gross Profit</span>
                  <span className={`font-semibold font-mono ${preview.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(preview.profit)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline text-xs px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary text-xs px-5 shadow-lg shadow-blue-600/30"
            >
              {loading ? 'Recording...' : 'Confirm Dispatch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
