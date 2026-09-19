import React, { useState, useEffect } from 'react';
import { X, Edit2, ShieldAlert, AlertCircle, ShoppingBag, RotateCcw, Undo2, ArrowLeftRight, Truck, Megaphone, Landmark } from 'lucide-react';
import { api } from '../services/api';
import { formatCurrency, formatPercent } from '../utils/formatters';

// -------------------------------------------------------------------
// 1. Sales Edit Modal (All Sales Fields Editable + Live Financial Preview)
// -------------------------------------------------------------------
export function SalesEditModal({ order, sale, isOpen = true, onClose, onSuccess }) {
  const currentOrder = order || sale;
  const [date, setDate] = useState('');
  const [styleNo, setStyleNo] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [sellingPrice, setSellingPrice] = useState('');
  const [totalRevenue, setTotalRevenue] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state whenever order prop changes or modal opens
  useEffect(() => {
    if (currentOrder) {
      setDate(currentOrder.date || '');
      setStyleNo(currentOrder.style_no || '');
      setQuantity(String(currentOrder.quantity_sold ?? 1));
      setSellingPrice(String(currentOrder.selling_price ?? ''));
      setTotalRevenue(String(currentOrder.total_revenue ?? ''));
      setReference(currentOrder.reference || 'Sale');
      setError(null);
    }
  }, [currentOrder, isOpen]);

  if (!isOpen || !currentOrder) return null;

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

  // Preview calculations
  const qNum = parseInt(quantity, 10) || 0;
  const pNum = parseFloat(sellingPrice) || 0;
  const rNum = parseFloat(totalRevenue) || (qNum * pNum);
  const unitCost = currentOrder?.unit_purchase_cost || 0;
  const previewCogs = qNum * unitCost;
  const previewProfit = rNum - previewCogs;
  const previewMargin = rNum > 0 ? (previewProfit / rNum) * 100 : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!styleNo.trim()) {
      setError('Please provide a Style SKU.');
      return;
    }
    const q = parseInt(quantity, 10);
    if (isNaN(q) || q < 1) {
      setError('Quantity must be at least 1.');
      return;
    }
    const p = parseFloat(sellingPrice);
    const r = parseFloat(totalRevenue);
    if ((isNaN(p) || p <= 0) && (isNaN(r) || r <= 0)) {
      setError('Please provide either Unit Selling Price or Total Revenue.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.updateSale(currentOrder.id, {
        date,
        style_no: styleNo.trim().toUpperCase(),
        quantity_sold: q,
        selling_price: p > 0 ? p : undefined,
        total_revenue: r > 0 ? r : undefined,
        reference: reference.trim() || 'Sale',
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update sales order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-6 border border-slate-700 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-heading">Edit Sales Order #{currentOrder.sl_no || currentOrder.id}</h3>
              <p className="text-xs text-slate-400">Modify Order Parameters & Recalculate Ledger COGS</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
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
              <label htmlFor="edit-sale-date" className="block text-xs font-semibold text-slate-300 mb-1">Dispatch Date</label>
              <input
                id="edit-sale-date"
                name="sale_date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-sale-quantity" className="block text-xs font-semibold text-slate-300 mb-1">Quantity Sold</label>
              <input
                id="edit-sale-quantity"
                name="sale_quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                onBlur={() => {
                  if (!quantity || parseInt(quantity, 10) < 1) handleQuantityChange('1');
                }}
                required
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-sale-style" className="block text-xs font-semibold text-slate-300 mb-1">Style SKU</label>
            <input
              id="edit-sale-style"
              name="sale_style"
              type="text"
              value={styleNo}
              onChange={(e) => setStyleNo(e.target.value)}
              required
              className="input-field uppercase font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-sale-price" className="block text-xs font-semibold text-slate-300 mb-1">Selling Price ($)</label>
              <input
                id="edit-sale-price"
                name="sale_price"
                type="number"
                step="0.01"
                min="0"
                value={sellingPrice}
                onChange={(e) => handlePriceChange(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-sale-total" className="block text-xs font-semibold text-slate-300 mb-1">Total Revenue ($)</label>
              <input
                id="edit-sale-total"
                name="sale_total"
                type="number"
                step="0.01"
                min="0"
                value={totalRevenue}
                onChange={(e) => handleRevenueChange(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-sale-reference" className="block text-xs font-semibold text-slate-300 mb-1">Reference / Channel</label>
            <input
              id="edit-sale-reference"
              name="sale_reference"
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. Sale, Shopify #1042"
              className="input-field"
            />
          </div>

          {/* Live Recalculation Preview */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5 shadow-inner">
            <div className="flex items-center justify-between font-bold text-white pb-1.5 border-b border-slate-800">
              <span>Recalculated Margins (Live WAC)</span>
              <span className={previewProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {formatPercent(previewMargin / 100)} Margin
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-slate-300">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Revenue</span>
                <span className="font-semibold text-white font-mono">{formatCurrency(rNum)}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">COGS ({qNum}x)</span>
                <span className="font-semibold text-white font-mono">{formatCurrency(previewCogs)}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Gross Profit</span>
                <span className={`font-semibold font-mono ${previewProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(previewProfit)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs px-4">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs px-5 shadow-lg shadow-blue-600/30">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 2. RTO Edit Modal (All RTO Fields Fully Editable)
// -------------------------------------------------------------------
export function RTOEditModal({ rto, item, isOpen = true, onClose, onSuccess }) {
  const currentRto = rto || item;
  const [date, setDate] = useState('');
  const [styleNo, setStyleNo] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [salePrice, setSalePrice] = useState('');
  const [courierFee, setCourierFee] = useState('0');
  const [trackingNo, setTrackingNo] = useState('');
  const [status, setStatus] = useState('In Transit');
  const [receivedDate, setReceivedDate] = useState('');
  const [restockedDate, setRestockedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentRto) {
      setDate(currentRto.date || '');
      setStyleNo(currentRto.style_no || '');
      setQuantity(String(currentRto.quantity ?? 1));
      setSalePrice(String(currentRto.sale_price ?? ''));
      setCourierFee(String(currentRto.courier_fee ?? 0));
      setTrackingNo(currentRto.tracking_no || '');
      setStatus(currentRto.status || 'In Transit');
      setReceivedDate(currentRto.received_date || '');
      setRestockedDate(currentRto.restocked_date || '');
      setNotes(currentRto.notes || '');
      setError(null);
    }
  }, [currentRto, isOpen]);

  if (!isOpen || !currentRto) return null;

  const reversedRevenuePreview = (parseInt(quantity, 10) || 0) * (parseFloat(salePrice) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!styleNo.trim()) {
      setError('Please provide a Style SKU.');
      return;
    }
    const q = parseInt(quantity, 10);
    if (isNaN(q) || q < 1) {
      setError('Quantity must be at least 1.');
      return;
    }
    const p = parseFloat(salePrice);
    if (isNaN(p) || p < 0) {
      setError('Please provide a valid sale price.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.updateRTO(currentRto.id, {
        date,
        style_no: styleNo.trim().toUpperCase(),
        quantity: q,
        sale_price: p,
        courier_fee: parseFloat(courierFee) || 0,
        tracking_no: trackingNo.trim() || null,
        status,
        received_date: receivedDate || null,
        restocked_date: restockedDate || null,
        notes: notes.trim() || null,
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update RTO parcel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-6 border border-slate-700 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-heading">Edit RTO Parcel {currentRto.rto_id}</h3>
              <p className="text-xs text-slate-400">All Logistics, SKU & Financial Fields Editable</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
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
              <label htmlFor="edit-rto-date" className="block text-xs font-semibold text-slate-300 mb-1">Initiated Date</label>
              <input
                id="edit-rto-date"
                name="rto_date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-rto-status" className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                id="edit-rto-status"
                name="rto_status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-field"
              >
                <option value="In Transit">In Transit</option>
                <option value="Received">Received (Dock)</option>
                <option value="Restocked">Restocked</option>
                <option value="Damaged">Damaged (Loss)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-rto-style" className="block text-xs font-semibold text-slate-300 mb-1">Style SKU</label>
              <input
                id="edit-rto-style"
                name="rto_style"
                type="text"
                value={styleNo}
                onChange={(e) => setStyleNo(e.target.value)}
                required
                className="input-field uppercase font-mono"
              />
            </div>
            <div>
              <label htmlFor="edit-rto-quantity" className="block text-xs font-semibold text-slate-300 mb-1">Quantity</label>
              <input
                id="edit-rto-quantity"
                name="rto_quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onBlur={() => {
                  if (!quantity || parseInt(quantity, 10) < 1) setQuantity('1');
                }}
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-rto-price" className="block text-xs font-semibold text-slate-300 mb-1">Sale Price ($)</label>
              <input
                id="edit-rto-price"
                name="rto_price"
                type="number"
                step="0.01"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-rto-fee" className="block text-xs font-semibold text-slate-300 mb-1">Courier Fee ($)</label>
              <input
                id="edit-rto-fee"
                name="rto_fee"
                type="number"
                step="0.01"
                min="0"
                value={courierFee}
                onChange={(e) => setCourierFee(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-rto-tracking" className="block text-xs font-semibold text-slate-300 mb-1">Carrier Tracking AWB</label>
            <input
              id="edit-rto-tracking"
              name="rto_tracking"
              type="text"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              placeholder="e.g. DELHIV-RTO-99201"
              className="input-field font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-rto-received-date" className="block text-xs font-semibold text-slate-300 mb-1">Date Received (Dock)</label>
              <input
                id="edit-rto-received-date"
                name="rto_received_date"
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-rto-restocked-date" className="block text-xs font-semibold text-slate-300 mb-1">Date Restocked</label>
              <input
                id="edit-rto-restocked-date"
                name="rto_restocked_date"
                type="date"
                value={restockedDate}
                onChange={(e) => setRestockedDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-rto-notes" className="block text-xs font-semibold text-slate-300 mb-1">Operational Notes</label>
            <textarea
              id="edit-rto-notes"
              name="rto_notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              className="input-field"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs flex justify-between items-center">
            <span className="text-slate-400">Reversed Gross Revenue:</span>
            <span className="font-mono font-bold text-amber-400">{formatCurrency(reversedRevenuePreview)}</span>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs px-4">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs px-5 shadow-lg shadow-blue-600/30">
              {loading ? 'Saving...' : 'Update RTO Parcel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 3. Customer Returns Full Edit Modal (All Return & QC Fields Editable)
// -------------------------------------------------------------------
export function CustomerReturnEditModal({ ret, returnItem, isOpen = true, onClose, onSuccess }) {
  const currentReturn = ret || returnItem;
  const [date, setDate] = useState('');
  const [styleNo, setStyleNo] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [refundAmount, setRefundAmount] = useState('');
  const [reverseFee, setReverseFee] = useState('175.00');
  const [primaryReason, setPrimaryReason] = useState('Size Too Small / Fit Issue');
  const [secondaryReason, setSecondaryReason] = useState('');
  const [reverseAwb, setReverseAwb] = useState('');
  const [status, setStatus] = useState('In Transit');
  const [grade, setGrade] = useState('Grade A');
  const [receivedDate, setReceivedDate] = useState('');
  const [restockedDate, setRestockedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentReturn) {
      setDate(currentReturn.date || '');
      setStyleNo(currentReturn.style_no || '');
      setQuantity(String(currentReturn.quantity ?? 1));
      setRefundAmount(String(currentReturn.refund_amount ?? ''));
      setReverseFee(String(currentReturn.reverse_fee ?? 175));
      setPrimaryReason(currentReturn.primary_reason || 'Size Too Small / Fit Issue');
      setSecondaryReason(currentReturn.secondary_reason || '');
      setReverseAwb(currentReturn.reverse_awb || '');
      setStatus(currentReturn.status || 'In Transit');
      setGrade(currentReturn.qc_grade || 'Grade A');
      setReceivedDate(currentReturn.received_date || '');
      setRestockedDate(currentReturn.restocked_date || '');
      setNotes(currentReturn.notes || '');
      setError(null);
    }
  }, [currentReturn, isOpen]);

  if (!isOpen || !currentReturn) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!styleNo.trim()) {
      setError('Please provide a Style SKU.');
      return;
    }
    const q = parseInt(quantity, 10);
    if (isNaN(q) || q < 1) {
      setError('Quantity must be at least 1.');
      return;
    }
    const refAmt = parseFloat(refundAmount);
    if (isNaN(refAmt) || refAmt < 0) {
      setError('Please enter a valid refund amount.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.updateReturn(currentReturn.id, {
        date,
        style_no: styleNo.trim().toUpperCase(),
        quantity: q,
        refund_amount: refAmt,
        reverse_fee: parseFloat(reverseFee) || 0,
        primary_reason: primaryReason,
        secondary_reason: secondaryReason.trim() || null,
        reverse_awb: reverseAwb.trim() || null,
        status,
        qc_grade: grade,
        received_date: receivedDate || null,
        restocked_date: restockedDate || null,
        notes: notes.trim() || null,
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update customer return.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-6 border border-slate-700 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Undo2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-heading">Edit Customer Return {currentReturn.return_id}</h3>
              <p className="text-xs text-slate-400">All Return Logistics, Financials & QC Grading</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
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
              <label htmlFor="edit-ret-date" className="block text-xs font-semibold text-slate-300 mb-1">Return Date</label>
              <input
                id="edit-ret-date"
                name="ret_date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-ret-status" className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                id="edit-ret-status"
                name="ret_status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-field"
              >
                <option value="In Transit">In Transit</option>
                <option value="Received">Received (Dock)</option>
                <option value="Restocked">Restocked</option>
                <option value="Damaged">Damaged (Loss)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-ret-style" className="block text-xs font-semibold text-slate-300 mb-1">Style SKU</label>
              <input
                id="edit-ret-style"
                name="ret_style"
                type="text"
                value={styleNo}
                onChange={(e) => setStyleNo(e.target.value)}
                required
                className="input-field uppercase font-mono"
              />
            </div>
            <div>
              <label htmlFor="edit-ret-qty" className="block text-xs font-semibold text-slate-300 mb-1">Quantity</label>
              <input
                id="edit-ret-qty"
                name="ret_qty"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onBlur={() => {
                  if (!quantity || parseInt(quantity, 10) < 1) setQuantity('1');
                }}
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-ret-refund" className="block text-xs font-semibold text-slate-300 mb-1">Refund Amount ($)</label>
              <input
                id="edit-ret-refund"
                name="ret_refund"
                type="number"
                step="0.01"
                min="0"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-ret-fee" className="block text-xs font-semibold text-slate-300 mb-1">Reverse Fee ($)</label>
              <input
                id="edit-ret-fee"
                name="ret_fee"
                type="number"
                step="0.01"
                min="0"
                value={reverseFee}
                onChange={(e) => setReverseFee(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-ret-reason" className="block text-xs font-semibold text-slate-300 mb-1">Primary Return Reason</label>
            <select
              id="edit-ret-reason"
              name="ret_reason"
              value={primaryReason}
              onChange={(e) => setPrimaryReason(e.target.value)}
              className="input-field"
            >
              <option value="Size Too Small / Fit Issue">Size Too Small / Fit Issue</option>
              <option value="Size Too Large / Fit Issue">Size Too Large / Fit Issue</option>
              <option value="Color Not As Pictured">Color Not As Pictured</option>
              <option value="Fabric / Stitch Quality Defect">Fabric / Stitch Quality Defect</option>
              <option value="Changed Mind / Buyer Remorse">Changed Mind / Buyer Remorse</option>
              <option value="Incorrect Item Dispatched">Incorrect Item Dispatched</option>
              <option value="Arrived Too Late">Arrived Too Late</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-ret-secondary" className="block text-xs font-semibold text-slate-300 mb-1">Secondary Reason</label>
              <input
                id="edit-ret-secondary"
                name="ret_secondary"
                type="text"
                value={secondaryReason}
                onChange={(e) => setSecondaryReason(e.target.value)}
                placeholder="Optional customer feedback"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-ret-awb" className="block text-xs font-semibold text-slate-300 mb-1">Reverse Courier & AWB</label>
              <input
                id="edit-ret-awb"
                name="ret_awb"
                type="text"
                value={reverseAwb}
                onChange={(e) => setReverseAwb(e.target.value)}
                placeholder="e.g. BLUEDART-CR-8821"
                className="input-field font-mono"
              />
            </div>
          </div>

          {/* Physical QC Grading Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              <span>Physical Quality Grade</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'Grade A', desc: 'Pristine (Eligible Restock)' },
                { id: 'Grade B', desc: 'Minor Issue (Repackage/Restock)' },
                { id: 'Damaged', desc: 'Torn/Stained (COGS Loss)' },
                { id: 'Dispute', desc: 'Fraud / Empty Parcel' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGrade(g.id)}
                  className={`p-2 rounded-lg text-left text-xs transition-all border cursor-pointer ${
                    grade === g.id
                      ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold">{g.id}</div>
                  <div className="text-[10px] text-slate-400">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-ret-received-date" className="block text-xs font-semibold text-slate-300 mb-1">Date Received (Dock)</label>
              <input
                id="edit-ret-received-date"
                name="ret_received_date"
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-ret-restocked-date" className="block text-xs font-semibold text-slate-300 mb-1">Date Restocked</label>
              <input
                id="edit-ret-restocked-date"
                name="ret_restocked_date"
                type="date"
                value={restockedDate}
                onChange={(e) => setRestockedDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-ret-notes" className="block text-xs font-semibold text-slate-300 mb-1">Inspector / Return Notes</label>
            <textarea
              id="edit-ret-notes"
              name="ret_notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Inspection findings, customer comments..."
              className="input-field"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs px-4">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs px-5 shadow-lg shadow-blue-600/30">
              {loading ? 'Saving...' : 'Update Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Alias for backwards compatibility
export const ReturnsQCEditModal = CustomerReturnEditModal;

// -------------------------------------------------------------------
// 4. Item Exchange Edit Modal (All Exchange Fields Fully Editable)
// -------------------------------------------------------------------
export function ExchangeEditModal({ exchange, item, isOpen = true, onClose, onSuccess }) {
  const currentExchange = exchange || item;
  const [date, setDate] = useState('');
  const [originalStyle, setOriginalStyle] = useState('');
  const [exchangedStyle, setExchangedStyle] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [standardPrice, setStandardPrice] = useState('');
  const [reverseFee, setReverseFee] = useState('175.00');
  const [primaryReason, setPrimaryReason] = useState('Size/Fit Swap');
  const [secondaryReason, setSecondaryReason] = useState('');
  const [reverseAwb, setReverseAwb] = useState('');
  const [returnStatus, setReturnStatus] = useState('In Transit');
  const [exchangeStatus, setExchangeStatus] = useState('Dispatched');
  const [receivedDate, setReceivedDate] = useState('');
  const [restockedDate, setRestockedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentExchange) {
      setDate(currentExchange.date || '');
      setOriginalStyle(currentExchange.original_style || '');
      setExchangedStyle(currentExchange.exchanged_style || '');
      setQuantity(String(currentExchange.quantity ?? 1));
      setStandardPrice(String(currentExchange.standard_price ?? ''));
      setReverseFee(String(currentExchange.reverse_fee ?? 175));
      setPrimaryReason(currentExchange.primary_reason || 'Size/Fit Swap');
      setSecondaryReason(currentExchange.secondary_reason || '');
      setReverseAwb(currentExchange.reverse_awb || '');
      setReturnStatus(currentExchange.return_status || 'In Transit');
      setExchangeStatus(currentExchange.exchange_status || 'Dispatched');
      setReceivedDate(currentExchange.received_date || '');
      setRestockedDate(currentExchange.restocked_date || '');
      setError(null);
    }
  }, [currentExchange, isOpen]);

  if (!isOpen || !currentExchange) return null;

  const qNum = parseInt(quantity, 10) || 0;
  const pNum = parseFloat(standardPrice) || 0;
  const fNum = parseFloat(reverseFee) || 0;
  const settlementPreview = (pNum * qNum) - fNum;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalStyle.trim() || !exchangedStyle.trim()) {
      setError('Please provide both Returned and Dispatched Style SKUs.');
      return;
    }
    const q = parseInt(quantity, 10);
    if (isNaN(q) || q < 1) {
      setError('Quantity must be at least 1.');
      return;
    }
    const p = parseFloat(standardPrice);
    if (isNaN(p) || p < 0) {
      setError('Please enter a valid standard price.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.updateExchange(currentExchange.id, {
        date,
        original_style: originalStyle.trim().toUpperCase(),
        exchanged_style: exchangedStyle.trim().toUpperCase(),
        quantity: q,
        standard_price: p,
        reverse_fee: parseFloat(reverseFee) || 0,
        primary_reason: primaryReason,
        secondary_reason: secondaryReason.trim() || null,
        reverse_awb: reverseAwb.trim() || null,
        return_status: returnStatus,
        exchange_status: exchangeStatus,
        received_date: receivedDate || null,
        restocked_date: restockedDate || null,
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update exchange.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-6 border border-slate-700 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-heading">Edit Exchange {currentExchange.exchange_id}</h3>
              <p className="text-xs text-slate-400">All Dual-SKU & Reverse Pipeline Parameters Editable</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
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
              <label htmlFor="edit-exch-date" className="block text-xs font-semibold text-slate-300 mb-1">Exchange Date</label>
              <input
                id="edit-exch-date"
                name="exch_date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-exch-qty" className="block text-xs font-semibold text-slate-300 mb-1">Quantity</label>
              <input
                id="edit-exch-qty"
                name="exch_qty"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onBlur={() => {
                  if (!quantity || parseInt(quantity, 10) < 1) setQuantity('1');
                }}
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-exch-orig-sku" className="block text-xs font-semibold text-slate-300 mb-1">Returned SKU (Inflow)</label>
              <input
                id="edit-exch-orig-sku"
                name="exch_orig_sku"
                type="text"
                value={originalStyle}
                onChange={(e) => setOriginalStyle(e.target.value)}
                required
                className="input-field uppercase font-mono"
              />
            </div>
            <div>
              <label htmlFor="edit-exch-disp-sku" className="block text-xs font-semibold text-slate-300 mb-1">Dispatched SKU (Outflow)</label>
              <input
                id="edit-exch-disp-sku"
                name="exch_disp_sku"
                type="text"
                value={exchangedStyle}
                onChange={(e) => setExchangedStyle(e.target.value)}
                required
                className="input-field uppercase font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-exch-return-status" className="block text-xs font-semibold text-slate-300 mb-1">Return Status</label>
              <select
                id="edit-exch-return-status"
                name="exch_return_status"
                value={returnStatus}
                onChange={(e) => setReturnStatus(e.target.value)}
                className="input-field"
              >
                <option value="In Transit">In Transit</option>
                <option value="Received">Received (Dock)</option>
                <option value="Restocked">Restocked</option>
                <option value="Damaged">Damaged (Loss)</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-exch-disp-status" className="block text-xs font-semibold text-slate-300 mb-1">Dispatch Status</label>
              <select
                id="edit-exch-disp-status"
                name="exch_disp_status"
                value={exchangeStatus}
                onChange={(e) => setExchangeStatus(e.target.value)}
                className="input-field"
              >
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-exch-std-price" className="block text-xs font-semibold text-slate-300 mb-1">Standard Price ($)</label>
              <input
                id="edit-exch-std-price"
                name="exch_std_price"
                type="number"
                step="0.01"
                min="0"
                value={standardPrice}
                onChange={(e) => setStandardPrice(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-exch-fee" className="block text-xs font-semibold text-slate-300 mb-1">Reverse Fee ($)</label>
              <input
                id="edit-exch-fee"
                name="exch_fee"
                type="number"
                step="0.01"
                min="0"
                value={reverseFee}
                onChange={(e) => setReverseFee(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-exch-reason" className="block text-xs font-semibold text-slate-300 mb-1">Primary Return Reason</label>
            <select
              id="edit-exch-reason"
              name="exch_reason"
              value={primaryReason}
              onChange={(e) => setPrimaryReason(e.target.value)}
              className="input-field"
            >
              <option value="Size/Fit Swap">Size/Fit Swap</option>
              <option value="Size Too Small / Fit Issue">Size Too Small / Fit Issue</option>
              <option value="Size Too Large / Fit Issue">Size Too Large / Fit Issue</option>
              <option value="Color Preference">Color Preference</option>
              <option value="Style Change">Style Change</option>
              <option value="Fabric Quality Issue">Fabric Quality Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-exch-secondary" className="block text-xs font-semibold text-slate-300 mb-1">Secondary Reason</label>
              <input
                id="edit-exch-secondary"
                name="exch_secondary"
                type="text"
                value={secondaryReason}
                onChange={(e) => setSecondaryReason(e.target.value)}
                placeholder="Optional customer feedback"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-exch-awb" className="block text-xs font-semibold text-slate-300 mb-1">Reverse Courier & AWB</label>
              <input
                id="edit-exch-awb"
                name="exch_awb"
                type="text"
                value={reverseAwb}
                onChange={(e) => setReverseAwb(e.target.value)}
                placeholder="e.g. DELHIV-EX-991280"
                className="input-field font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-exch-received-date" className="block text-xs font-semibold text-slate-300 mb-1">Date Received (Dock)</label>
              <input
                id="edit-exch-received-date"
                name="exch_received_date"
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-exch-restocked-date" className="block text-xs font-semibold text-slate-300 mb-1">Date Restocked</label>
              <input
                id="edit-exch-restocked-date"
                name="exch_restocked_date"
                type="date"
                value={restockedDate}
                onChange={(e) => setRestockedDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs flex justify-between items-center">
            <span className="text-slate-400">Net Financial Settlement Preview:</span>
            <span className="font-mono font-bold text-emerald-400">{formatCurrency(settlementPreview)}</span>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs px-4">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs px-5 shadow-lg shadow-blue-600/30">
              {loading ? 'Saving...' : 'Update Exchange'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 5. Procurement Batch Edit Modal (All Inflow Batch Fields Editable)
// -------------------------------------------------------------------
export function ProcurementEditModal({ batch, item, isOpen = true, onClose, onSuccess }) {
  const currentBatch = batch || item;
  const [date, setDate] = useState('');
  const [styleNo, setStyleNo] = useState('');
  const [inventory, setInventory] = useState('1');
  const [purchaseRate, setPurchaseRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentBatch) {
      setDate(currentBatch.date || '');
      setStyleNo(currentBatch.style_no || '');
      setInventory(String(currentBatch.inventory ?? 1));
      setPurchaseRate(String(currentBatch.purchase_rate ?? ''));
      setError(null);
    }
  }, [currentBatch, isOpen]);

  if (!isOpen || !currentBatch) return null;

  const invNum = parseInt(inventory, 10) || 0;
  const rateNum = parseFloat(purchaseRate) || 0;
  const totalValuePreview = invNum * rateNum;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!styleNo.trim()) {
      setError('Please enter a Style SKU.');
      return;
    }
    const inv = parseInt(inventory, 10);
    if (isNaN(inv) || inv < 1) {
      setError('Inward inventory units must be at least 1.');
      return;
    }
    const rate = parseFloat(purchaseRate);
    if (isNaN(rate) || rate <= 0) {
      setError('Please provide a valid purchase rate.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.updateProcurement(currentBatch.id, {
        date,
        style_no: styleNo.trim().toUpperCase(),
        inventory: inv,
        purchase_rate: rate,
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update procurement batch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 border border-slate-700 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-heading">Edit Procurement Batch #{currentBatch.id}</h3>
              <p className="text-xs text-slate-400">Modify Inward PO Batch & Recalculate WAC Cost</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
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
          <div>
            <label htmlFor="edit-proc-date" className="block text-xs font-semibold text-slate-300 mb-1">Arrival Date</label>
            <input
              id="edit-proc-date"
              name="proc_date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="edit-proc-style" className="block text-xs font-semibold text-slate-300 mb-1">Style SKU</label>
            <input
              id="edit-proc-style"
              name="proc_style"
              type="text"
              value={styleNo}
              onChange={(e) => setStyleNo(e.target.value)}
              required
              className="input-field uppercase font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-proc-inv" className="block text-xs font-semibold text-slate-300 mb-1">Inward Units</label>
              <input
                id="edit-proc-inv"
                name="proc_inv"
                type="number"
                min="1"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                onBlur={() => {
                  if (!inventory || parseInt(inventory, 10) < 1) setInventory('1');
                }}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="edit-proc-rate" className="block text-xs font-semibold text-slate-300 mb-1">Purchase Rate ($)</label>
              <input
                id="edit-proc-rate"
                name="proc_rate"
                type="number"
                step="0.01"
                min="0"
                value={purchaseRate}
                onChange={(e) => setPurchaseRate(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs flex justify-between items-center">
            <span className="text-slate-400">Total Batch Value:</span>
            <span className="font-mono font-bold text-emerald-400">{formatCurrency(totalValuePreview)}</span>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs px-4">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs px-5 shadow-lg shadow-blue-600/30">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 6. Ad Spend Edit Modal (All Ad Fields Fully Editable)
// -------------------------------------------------------------------
export function AdEditModal({ ad, campaign, isOpen = true, onClose, onSuccess }) {
  const currentAd = ad || campaign;
  const [date, setDate] = useState('');
  const [platform, setPlatform] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentAd) {
      setDate(currentAd.date || '');
      setPlatform(currentAd.platform || '');
      setAmount(String(currentAd.amount ?? ''));
      setNotes(currentAd.notes || '');
      setError(null);
    }
  }, [currentAd, isOpen]);

  if (!isOpen || !currentAd) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!platform.trim()) {
      setError('Please enter a marketing platform channel.');
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Please provide a valid ad spend amount.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.updateAd(currentAd.id, {
        date,
        platform: platform.trim(),
        amount: amt,
        notes: notes.trim() || null,
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update ad spend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 border border-slate-700 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-heading">Edit Ad Campaign Entry</h3>
              <p className="text-xs text-slate-400">Marketing Spend & Platform Attribution</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
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
          <div>
            <label htmlFor="edit-ad-date" className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
            <input
              id="edit-ad-date"
              name="ad_date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="edit-ad-platform" className="block text-xs font-semibold text-slate-300 mb-1">Platform Channel</label>
            <input
              id="edit-ad-platform"
              name="ad_platform"
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="e.g. Meta Ads, Google Ads, TikTok"
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="edit-ad-amount" className="block text-xs font-semibold text-slate-300 mb-1">Amount ($)</label>
            <input
              id="edit-ad-amount"
              name="ad_amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="edit-ad-notes" className="block text-xs font-semibold text-slate-300 mb-1">Campaign Notes</label>
            <textarea
              id="edit-ad-notes"
              name="ad_notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Retargeting campaign test..."
              className="input-field"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs px-4">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs px-5 shadow-lg shadow-blue-600/30">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 7. Bank Transaction Edit Modal (All Bank Fields Fully Editable)
// -------------------------------------------------------------------
export function BankEditModal({ tx, transaction, isOpen = true, onClose, onSuccess }) {
  const currentTx = tx || transaction;
  const [date, setDate] = useState('');
  const [type, setType] = useState('Credited (+)');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentTx) {
      setDate(currentTx.date || '');
      setType(currentTx.type || 'Credited (+)');
      setAmount(String(currentTx.amount ?? ''));
      setError(null);
    }
  }, [currentTx, isOpen]);

  if (!isOpen || !currentTx) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Please provide a valid transaction amount.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.updateBank(currentTx.id, {
        date,
        type,
        amount: amt,
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update bank transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 border border-slate-700 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-heading">Edit Bank Entry #{currentTx.sl_no || currentTx.id}</h3>
              <p className="text-xs text-slate-400">Cash Flow Entry & Continuous Balance Recalculation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
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
          <div>
            <label htmlFor="edit-bank-date" className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
            <input
              id="edit-bank-date"
              name="bank_date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="edit-bank-type" className="block text-xs font-semibold text-slate-300 mb-1">Transaction Type</label>
            <select
              id="edit-bank-type"
              name="bank_type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field"
            >
              <option value="Credited (+)">Credited (+) [Deposit / Inflow]</option>
              <option value="Debited (-)">Debited (-) [Withdrawal / Outflow]</option>
            </select>
          </div>

          <div>
            <label htmlFor="edit-bank-amount" className="block text-xs font-semibold text-slate-300 mb-1">Amount ($)</label>
            <input
              id="edit-bank-amount"
              name="bank_amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs px-4">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs px-5 shadow-lg shadow-blue-600/30">
              {loading ? 'Saving...' : 'Save & Recalculate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
