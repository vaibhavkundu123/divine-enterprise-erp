import React, { useState } from 'react';
import { X, Edit2, ShieldAlert, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

// -------------------------------------------------------------------
// 1. Sales Edit Modal
// -------------------------------------------------------------------
export function SalesEditModal({ order, isOpen, onClose, onSuccess }) {
  if (!isOpen || !order) return null;
  const [date, setDate] = useState(order.date);
  const [styleNo, setStyleNo] = useState(order.style_no);
  const [quantity, setQuantity] = useState(order.quantity_sold);
  const [sellingPrice, setSellingPrice] = useState(order.selling_price);
  const [totalRevenue, setTotalRevenue] = useState(order.total_revenue);
  const [reference, setReference] = useState(order.reference || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateSale(order.id, {
        date,
        style_no: styleNo,
        quantity_sold: parseInt(quantity, 10),
        selling_price: parseFloat(sellingPrice),
        total_revenue: parseFloat(totalRevenue),
        reference,
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 border border-white/15">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
          <h3 className="font-bold text-white text-base">Edit Sales Order #{order.sl_no}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="edit-sale-date" className="text-xs text-slate-300 block mb-1">Date</label>
            <input id="edit-sale-date" name="sale_date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input-field" />
          </div>
          <div>
            <label htmlFor="edit-sale-style" className="text-xs text-slate-300 block mb-1">Style No.</label>
            <input id="edit-sale-style" name="sale_style" type="text" value={styleNo} onChange={(e) => setStyleNo(e.target.value)} required className="input-field uppercase" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="edit-sale-quantity" className="text-xs text-slate-300 block mb-1">Quantity</label>
              <input id="edit-sale-quantity" name="sale_quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="input-field" />
            </div>
            <div>
              <label htmlFor="edit-sale-price" className="text-xs text-slate-300 block mb-1">Selling Price ($)</label>
              <input id="edit-sale-price" name="sale_price" type="number" step="0.01" value={sellingPrice} onChange={(e) => {
                setSellingPrice(e.target.value);
                setTotalRevenue((parseFloat(e.target.value || 0) * quantity).toFixed(2));
              }} required className="input-field" />
            </div>
          </div>
          <div>
            <label htmlFor="edit-sale-total" className="text-xs text-slate-300 block mb-1">Total Revenue ($)</label>
            <input id="edit-sale-total" name="sale_total" type="number" step="0.01" value={totalRevenue} onChange={(e) => {
              setTotalRevenue(e.target.value);
              if (quantity > 0) setSellingPrice((parseFloat(e.target.value || 0) / quantity).toFixed(2));
            }} required className="input-field" />
          </div>
          <div>
            <label htmlFor="edit-sale-reference" className="text-xs text-slate-300 block mb-1">Reference</label>
            <input id="edit-sale-reference" name="sale_reference" type="text" value={reference} onChange={(e) => setReference(e.target.value)} className="input-field" />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs">{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 2. RTO Edit Modal
// -------------------------------------------------------------------
export function RTOEditModal({ rto, isOpen, onClose, onSuccess }) {
  if (!isOpen || !rto) return null;
  const [status, setStatus] = useState(rto.status);
  const [courierFee, setCourierFee] = useState(rto.courier_fee);
  const [trackingNo, setTrackingNo] = useState(rto.tracking_no || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateRTO(rto.id, {
        status,
        courier_fee: parseFloat(courierFee),
        tracking_no: trackingNo,
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 border border-white/15">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
          <h3 className="font-bold text-white text-base">Edit RTO Parcel {rto.rto_id}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="edit-rto-status" className="text-xs text-slate-300 block mb-1">Status</label>
            <select id="edit-rto-status" name="rto_status" value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
              <option value="In Transit">In Transit</option>
              <option value="Received">Received (Dock)</option>
              <option value="Restocked">Restocked</option>
              <option value="Damaged">Damaged (Loss)</option>
            </select>
          </div>
          <div>
            <label htmlFor="edit-rto-fee" className="text-xs text-slate-300 block mb-1">Courier Fee ($)</label>
            <input id="edit-rto-fee" name="rto_fee" type="number" step="0.01" value={courierFee} onChange={(e) => setCourierFee(e.target.value)} className="input-field" />
          </div>
          <div>
            <label htmlFor="edit-rto-tracking" className="text-xs text-slate-300 block mb-1">Carrier Tracking AWB</label>
            <input id="edit-rto-tracking" name="rto_tracking" type="text" value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} className="input-field" />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs">{loading ? 'Saving...' : 'Update RTO'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 3. Customer Returns QC Grading Modal
// -------------------------------------------------------------------
export function ReturnsQCEditModal({ ret, isOpen, onClose, onSuccess }) {
  if (!isOpen || !ret) return null;
  const [grade, setGrade] = useState(ret.qc_grade || 'Grade A');
  const [notes, setNotes] = useState(ret.notes || '');
  const [loading, setLoading] = useState(false);

  const handleGrade = async () => {
    setLoading(true);
    try {
      await api.qcReturn(ret.id, grade, notes);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 border border-white/15">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">QC Inspection: {ret.return_id}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div className="text-xs text-slate-300 p-2.5 rounded-lg bg-slate-900 border border-white/10">
            <div>Style: <strong className="text-white">{ret.style_no}</strong> | Quantity: <strong className="text-white">{ret.quantity}</strong></div>
            <div className="text-slate-400 mt-1">Reason: {ret.primary_reason}</div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Assign Physical Quality Grade</label>
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
                  className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                    grade === g.id
                      ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold">{g.id}</div>
                  <div className="text-[10px] text-slate-400">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="edit-qc-notes" className="text-xs text-slate-300 block mb-1">Inspector Notes</label>
            <textarea id="edit-qc-notes" name="qc_notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-field" placeholder="Inspection findings..." />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs">Cancel</button>
            <button type="button" onClick={handleGrade} disabled={loading} className="btn btn-primary text-xs">
              {loading ? 'Grading...' : 'Confirm QC Grade'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 4. Item Exchange Edit Modal
// -------------------------------------------------------------------
export function ExchangeEditModal({ exchange, isOpen, onClose, onSuccess }) {
  if (!isOpen || !exchange) return null;
  const [returnStatus, setReturnStatus] = useState(exchange.return_status);
  const [exchangeStatus, setExchangeStatus] = useState(exchange.exchange_status);
  const [reverseFee, setReverseFee] = useState(exchange.reverse_fee);
  const [standardPrice, setStandardPrice] = useState(exchange.standard_price);
  const [primaryReason, setPrimaryReason] = useState(exchange.primary_reason || 'Size/Fit Swap');
  const [secondaryReason, setSecondaryReason] = useState(exchange.secondary_reason || '');
  const [reverseAwb, setReverseAwb] = useState(exchange.reverse_awb || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateExchange(exchange.id, {
        return_status: returnStatus,
        exchange_status: exchangeStatus,
        reverse_fee: parseFloat(reverseFee),
        standard_price: parseFloat(standardPrice),
        primary_reason: primaryReason,
        secondary_reason: secondaryReason || null,
        reverse_awb: reverseAwb || null,
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 border border-white/15 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
          <h3 className="font-bold text-white text-base">Edit Exchange {exchange.exchange_id}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="edit-exch-return-status" className="text-xs text-slate-300 block mb-1">Return Status</label>
              <select id="edit-exch-return-status" name="exch_return_status" value={returnStatus} onChange={(e) => setReturnStatus(e.target.value)} className="input-field">
                <option value="In Transit">In Transit</option>
                <option value="Received">Received (Dock)</option>
                <option value="Restocked">Restocked</option>
                <option value="Damaged">Damaged (Loss)</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-exch-dispatch-status" className="text-xs text-slate-300 block mb-1">Dispatch Status</label>
              <select id="edit-exch-dispatch-status" name="exch_dispatch_status" value={exchangeStatus} onChange={(e) => setExchangeStatus(e.target.value)} className="input-field">
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="edit-exch-std-price" className="text-xs text-slate-300 block mb-1">Standard Price ($)</label>
              <input id="edit-exch-std-price" name="exch_std_price" type="number" step="0.01" value={standardPrice} onChange={(e) => setStandardPrice(e.target.value)} className="input-field" />
            </div>
            <div>
              <label htmlFor="edit-exch-reverse-fee" className="text-xs text-slate-300 block mb-1">Reverse Fee ($)</label>
              <input id="edit-exch-reverse-fee" name="exch_reverse_fee" type="number" step="0.01" value={reverseFee} onChange={(e) => setReverseFee(e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label htmlFor="edit-exch-primary-reason" className="text-xs text-slate-300 block mb-1">Primary Return Reason</label>
            <select id="edit-exch-primary-reason" name="exch_primary_reason" value={primaryReason} onChange={(e) => setPrimaryReason(e.target.value)} className="input-field">
              <option value="Size/Fit Swap">Size/Fit Swap</option>
              <option value="Size Too Small / Fit Issue">Size Too Small / Fit Issue</option>
              <option value="Size Too Large / Fit Issue">Size Too Large / Fit Issue</option>
              <option value="Color Preference">Color Preference</option>
              <option value="Style Change">Style Change</option>
              <option value="Fabric Quality Issue">Fabric Quality Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="edit-exch-secondary-reason" className="text-xs text-slate-300 block mb-1">Secondary Return Reason</label>
            <input
              id="edit-exch-secondary-reason"
              name="exch_secondary_reason"
              type="text"
              value={secondaryReason}
              onChange={(e) => setSecondaryReason(e.target.value)}
              placeholder="e.g. Customer wanted next size up"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="edit-exch-awb" className="text-xs text-slate-300 block mb-1">Reverse Courier & AWB #</label>
            <input
              id="edit-exch-awb"
              name="exch_awb"
              type="text"
              value={reverseAwb}
              onChange={(e) => setReverseAwb(e.target.value)}
              placeholder="e.g. DELHIV-EX-991280"
              className="input-field"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs">{loading ? 'Saving...' : 'Update Exchange'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 5. Ad Spend Edit Modal
// -------------------------------------------------------------------
export function AdEditModal({ ad, isOpen, onClose, onSuccess }) {
  if (!isOpen || !ad) return null;
  const [date, setDate] = useState(ad.date);
  const [platform, setPlatform] = useState(ad.platform);
  const [amount, setAmount] = useState(ad.amount);
  const [notes, setNotes] = useState(ad.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateAd(ad.id, {
        date,
        platform,
        amount: parseFloat(amount),
        notes,
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 border border-white/15">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
          <h3 className="font-bold text-white text-base">Edit Ad Campaign Entry</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="edit-ad-date" className="text-xs text-slate-300 block mb-1">Date</label>
            <input id="edit-ad-date" name="ad_date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input-field" />
          </div>
          <div>
            <label htmlFor="edit-ad-platform" className="text-xs text-slate-300 block mb-1">Platform</label>
            <input id="edit-ad-platform" name="ad_platform" type="text" value={platform} onChange={(e) => setPlatform(e.target.value)} required className="input-field" />
          </div>
          <div>
            <label htmlFor="edit-ad-amount" className="text-xs text-slate-300 block mb-1">Amount ($)</label>
            <input id="edit-ad-amount" name="ad_amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required className="input-field" />
          </div>
          <div>
            <label htmlFor="edit-ad-notes" className="text-xs text-slate-300 block mb-1">Notes</label>
            <textarea id="edit-ad-notes" name="ad_notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-field" />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs">{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// 6. Bank Transaction Edit Modal
// -------------------------------------------------------------------
export function BankEditModal({ tx, isOpen, onClose, onSuccess }) {
  if (!isOpen || !tx) return null;
  const [date, setDate] = useState(tx.date);
  const [type, setType] = useState(tx.type);
  const [amount, setAmount] = useState(tx.amount);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateBank(tx.id, {
        date,
        type,
        amount: parseFloat(amount),
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 border border-white/15">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
          <h3 className="font-bold text-white text-base">Edit Bank Transaction #{tx.sl_no}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="edit-bank-date" className="text-xs text-slate-300 block mb-1">Date</label>
            <input id="edit-bank-date" name="bank_date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input-field" />
          </div>
          <div>
            <label htmlFor="edit-bank-type" className="text-xs text-slate-300 block mb-1">Type</label>
            <select id="edit-bank-type" name="bank_type" value={type} onChange={(e) => setType(e.target.value)} className="input-field">
              <option value="Credited (+)">Credited (+) [Deposit / Inflow]</option>
              <option value="Debited (-)">Debited (-) [Withdrawal / Outflow]</option>
            </select>
          </div>
          <div>
            <label htmlFor="edit-bank-amount" className="text-xs text-slate-300 block mb-1">Amount ($)</label>
            <input id="edit-bank-amount" name="bank_amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required className="input-field" />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs">{loading ? 'Saving...' : 'Save & Recalculate'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
