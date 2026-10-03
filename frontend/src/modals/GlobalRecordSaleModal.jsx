import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag, DollarSign, Check, AlertCircle, Percent, ChevronDown } from 'lucide-react';
import { api } from '../services/api';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function GlobalRecordSaleModal({ isOpen, onClose, onSuccess, styleCatalog = [] }) {
  const [internalCatalog, setInternalCatalog] = useState(styleCatalog || []);
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isStyleTyping, setIsStyleTyping] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropUp, setDropUp] = useState(false);

  const styleContainerRef = useRef(null);
  const styleInputRef = useRef(null);
  const styleListRef = useRef(null);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [styleNo, setStyleNo] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [sellingPrice, setSellingPrice] = useState('');
  const [totalRevenue, setTotalRevenue] = useState('');
  const [reference, setReference] = useState('Sale');

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch fresh catalog whenever modal opens
  useEffect(() => {
    if (isOpen) {
      api.getStyleCatalog()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setInternalCatalog(data);
          }
        })
        .catch((err) => console.error('Failed to load style catalog:', err));
    }
  }, [isOpen]);

  // Keep internal catalog in sync with prop updates
  useEffect(() => {
    if (styleCatalog && styleCatalog.length > 0) {
      setInternalCatalog(styleCatalog);
    }
  }, [styleCatalog]);

  // Listen to cross-system catalog updates (e.g. from procurement batch creation)
  useEffect(() => {
    const handleUpdate = () => {
      api.getStyleCatalog()
        .then((data) => {
          if (Array.isArray(data)) {
            setInternalCatalog(data);
          }
        })
        .catch(() => {});
    };
    window.addEventListener('divine-catalog-updated', handleUpdate);
    return () => window.removeEventListener('divine-catalog-updated', handleUpdate);
  }, []);

  const effectiveCatalog = (internalCatalog && internalCatalog.length > 0) ? internalCatalog : styleCatalog;

  // Selected style metadata
  const selectedStyle = effectiveCatalog.find(
    (s) => s.style_no && s.style_no.toLowerCase() === styleNo.trim().toLowerCase()
  );

  // Filtered styles based on user search query
  const filteredStyles = useMemo(() => {
    if (!isStyleTyping || !styleNo) return effectiveCatalog;
    const lower = styleNo.toLowerCase().trim();
    return effectiveCatalog.filter((s) =>
      (s.style_no && s.style_no.toLowerCase().includes(lower)) ||
      (s.colour && s.colour.toLowerCase().includes(lower)) ||
      (s.sizing && s.sizing.toLowerCase().includes(lower))
    );
  }, [effectiveCatalog, styleNo, isStyleTyping]);

  // Close style dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (styleContainerRef.current && !styleContainerRef.current.contains(e.target)) {
        setIsStyleDropdownOpen(false);
        setIsStyleTyping(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dropup calculation
  useEffect(() => {
    if (isStyleDropdownOpen && styleContainerRef.current) {
      const rect = styleContainerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropUp(spaceBelow < 280 && spaceAbove > 200);
    }
  }, [isStyleDropdownOpen]);

  // Highlight index management
  useEffect(() => {
    if (isStyleDropdownOpen && filteredStyles.length > 0) {
      const idx = filteredStyles.findIndex(
        (s) => s.style_no && s.style_no.toLowerCase() === styleNo.trim().toLowerCase()
      );
      setHighlightedIndex(idx >= 0 ? idx : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isStyleDropdownOpen, isStyleTyping, filteredStyles, styleNo]);

  // Auto-scroll highlighted option into view
  useEffect(() => {
    if (isStyleDropdownOpen && highlightedIndex >= 0 && styleListRef.current) {
      const items = styleListRef.current.querySelectorAll('[data-style-item]');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isStyleDropdownOpen]);

  const handleSelectStyle = (s) => {
    setStyleNo(s.style_no);
    setIsStyleDropdownOpen(false);
    setIsStyleTyping(false);
    setHighlightedIndex(-1);

    // Auto-fill suggested selling price if not yet entered
    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      const suggested = (s.meesho_price && s.meesho_price > 0)
        ? s.meesho_price
        : s.suggested_price_35 || (s.unit_cost ? Math.round(s.unit_cost * 1.35) : 0);
      if (suggested > 0) {
        setSellingPrice(suggested.toString());
        const q = parseInt(quantity, 10) || 1;
        setTotalRevenue((suggested * q).toFixed(2));
      }
    }
  };

  const handleStyleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsStyleDropdownOpen(false);
      setIsStyleTyping(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isStyleDropdownOpen) {
        setIsStyleDropdownOpen(true);
        setIsStyleTyping(false);
        setHighlightedIndex(0);
      } else if (filteredStyles.length > 0) {
        setHighlightedIndex((prev) => (prev + 1) % filteredStyles.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isStyleDropdownOpen) {
        setIsStyleDropdownOpen(true);
        setIsStyleTyping(false);
        setHighlightedIndex(Math.max(0, filteredStyles.length - 1));
      } else if (filteredStyles.length > 0) {
        setHighlightedIndex((prev) => (prev - 1 + filteredStyles.length) % filteredStyles.length);
      }
    } else if (e.key === 'Enter') {
      if (isStyleDropdownOpen) {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredStyles.length) {
          handleSelectStyle(filteredStyles[highlightedIndex]);
        } else {
          setIsStyleDropdownOpen(false);
        }
      }
    }
  };

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

  return createPortal(
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
          <div ref={styleContainerRef} className="relative">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="sale-modal-style" className="block text-xs font-semibold text-slate-300">
                Style SKU <span className="text-rose-400">*</span>
              </label>
              {selectedStyle && (
                <span className="text-[11px] text-slate-400">
                  Stock: <strong className={selectedStyle.stock_on_hand > 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{selectedStyle.stock_on_hand}</strong> units | WAC: {formatCurrency(selectedStyle.unit_cost)}
                  {selectedStyle.meesho_price ? ` | MRP: ₹${selectedStyle.meesho_price}` : ''}
                </span>
              )}
            </div>
            
            <div className="relative flex items-center">
              <input
                ref={styleInputRef}
                id="sale-modal-style"
                name="sale_style_no"
                type="text"
                value={styleNo}
                onChange={(e) => {
                  setStyleNo(e.target.value);
                  setIsStyleTyping(true);
                  if (!isStyleDropdownOpen) setIsStyleDropdownOpen(true);
                }}
                onFocus={() => {
                  setIsStyleTyping(false);
                  setIsStyleDropdownOpen(true);
                }}
                onClick={() => {
                  if (!isStyleDropdownOpen) {
                    setIsStyleTyping(false);
                    setIsStyleDropdownOpen(true);
                  }
                }}
                onKeyDown={handleStyleKeyDown}
                placeholder="Type or select Style SKU (e.g. DE26010B)..."
                required
                autoComplete="off"
                className="input-field uppercase pr-16 font-mono"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                {styleNo && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStyleNo('');
                      setIsStyleTyping(false);
                      setIsStyleDropdownOpen(true);
                      styleInputRef.current?.focus();
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Clear Style"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsStyleDropdownOpen((prev) => !prev);
                    setIsStyleTyping(false);
                    if (!isStyleDropdownOpen) styleInputRef.current?.focus();
                  }}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Toggle Style Catalog"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isStyleDropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Custom Interactive Dropdown Menu */}
            {isStyleDropdownOpen && (
              <div
                ref={styleListRef}
                className={`absolute left-0 right-0 z-50 ${
                  dropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                } bg-slate-900/98 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-800 animate-fade-in`}
              >
                <div className="p-2 bg-slate-950/80 sticky top-0 z-10 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
                  <span className="font-semibold text-slate-300">
                    {filteredStyles.length} {filteredStyles.length === 1 ? 'Style' : 'Styles'} Available
                  </span>
                  <span className="text-[10px] text-slate-500">↑↓ keys to navigate, Enter to select</span>
                </div>

                {filteredStyles.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400">
                    No matching styles found for <span className="text-white font-mono">"{styleNo}"</span>.
                    <p className="text-[11px] text-slate-500 mt-0.5">You can still enter and submit this SKU.</p>
                  </div>
                ) : (
                  filteredStyles.map((s, idx) => {
                    const isSelected = s.style_no?.toLowerCase() === styleNo?.trim().toLowerCase();
                    const isHighlighted = idx === highlightedIndex;
                    return (
                      <div
                        key={s.style_no}
                        data-style-item
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectStyle(s);
                        }}
                        onClick={() => handleSelectStyle(s)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`p-2.5 flex items-center justify-between gap-2 cursor-pointer transition-colors text-xs ${
                          isSelected
                            ? 'bg-blue-600/25 border-l-4 border-l-blue-500'
                            : isHighlighted
                            ? 'bg-slate-800/90 text-white'
                            : 'hover:bg-slate-800/60 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono font-bold text-white tracking-wide">{s.style_no}</span>
                          {s.colour && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                              {s.colour}
                            </span>
                          )}
                          {s.sizing && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                              {s.sizing}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                              s.stock_on_hand > 0
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {s.stock_on_hand > 0 ? `${s.stock_on_hand} in stock` : '0 stock'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            WAC: <span className="text-slate-200">{formatCurrency(s.unit_cost)}</span>
                          </span>
                          {s.meesho_price ? (
                            <span className="text-[11px] text-blue-400 font-mono font-semibold">
                              ₹{s.meesho_price}
                            </span>
                          ) : null}
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
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
    </div>,
    document.body
  );
}
