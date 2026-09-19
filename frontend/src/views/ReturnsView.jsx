import React, { useState, useEffect } from 'react';
import { Undo2, Check, AlertTriangle, Download, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { CustomerReturnEditModal } from '../modals/EditModals';
import { formatCurrency } from '../utils/formatters';

export default function ReturnsView() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [qcModalReturn, setQcModalReturn] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Return form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [styleNo, setStyleNo] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [refundAmount, setRefundAmount] = useState('');
  const [reverseFee, setReverseFee] = useState(175);
  const [primaryReason, setPrimaryReason] = useState('Size Too Small / Fit Issue');
  const [secondaryReason, setSecondaryReason] = useState('');
  const [reverseAwb, setReverseAwb] = useState('');
  const [salesList, setSalesList] = useState([]);

  const loadReturns = () => {
    setLoading(true);
    api.getReturns()
      .then((data) => setReturns(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReturns();
    api.getSales()
      .then((data) => {
        if (Array.isArray(data)) setSalesList(data.slice(-35).reverse());
      })
      .catch((err) => console.error('Failed to load sales for return auto-fill:', err));
  }, []);

  const handleReceive = async (id) => {
    try {
      await api.receiveReturn(id);
      loadReturns();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRestock = async (id) => {
    try {
      await api.restockReturn(id);
      loadReturns();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDamage = async (id) => {
    if (!window.confirm('Write off this return as damaged / loss?')) return;
    try {
      await api.damageReturn(id);
      loadReturns();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBulkRestock = async () => {
    try {
      const res = await api.bulkRestockReturns();
      alert(res.message);
      loadReturns();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete customer return entry?')) return;
    try {
      await api.deleteReturn(id);
      loadReturns();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createReturn({
        date,
        style_no: styleNo.trim(),
        quantity: parseInt(quantity, 10),
        refund_amount: parseFloat(refundAmount),
        reverse_fee: parseFloat(reverseFee || 0),
        primary_reason: primaryReason,
        secondary_reason: secondaryReason || null,
        reverse_awb: reverseAwb || null,
      });
      setShowAddModal(false);
      setStyleNo('');
      setQuantity(1);
      setRefundAmount('');
      setReverseFee(175);
      setPrimaryReason('Size Too Small / Fit Issue');
      setSecondaryReason('');
      setReverseAwb('');
      loadReturns();
    } catch (err) {
      alert(err.message);
    }
  };

  const holdingCount = returns.filter((r) => r.status === 'Received' || r.status === 'Intake').length;

  const filtered = returns.filter((r) => {
    const matchSearch =
      r.style_no.toLowerCase().includes(search.toLowerCase()) ||
      (r.primary_reason && r.primary_reason.toLowerCase().includes(search.toLowerCase())) ||
      (r.reverse_awb && r.reverse_awb.toLowerCase().includes(search.toLowerCase()));
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'Received'
        ? (r.status === 'Received' || r.status === 'Intake')
        : r.status.toLowerCase() === statusFilter.toLowerCase());
    return matchSearch && matchStatus;
  });

  const getStatusPill = (status) => {
    switch (status) {
      case 'In Transit':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">In Transit</span>;
      case 'Received':
      case 'Intake':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 animate-pulse">Received (Dock)</span>;
      case 'Restocked':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Restocked</span>;
      case 'Damaged':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">Damaged (Loss)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  const handleExcelExport = () => {
    const formatted = filtered.map((r, i) => ({
      'Sl. No.': i + 1,
      Date: r.date,
      'Style SKU': r.style_no,
      Quantity: r.quantity,
      'Refund Amount ($)': r.refund_amount,
      'Reverse Fee ($)': r.reverse_fee,
      'Primary Reason': r.primary_reason,
      'Secondary Reason': r.secondary_reason || '',
      'Reverse AWB': r.reverse_awb || '',
      Status: r.status,
      'Date Received': r.received_date || '',
      'Date Restocked': r.restocked_date || '',
    }));
    exportToExcel(formatted, `Customer_Returns_${new Date().toISOString().split('T')[0]}.xlsx`, 'Customer Returns');
  };

  const handleCsvExport = () => {
    exportToCSV(filtered, `customer_returns_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-3" data-tour="returns-hud">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="relative w-full sm:w-64" data-tour="returns-search">
            <label htmlFor="returns-search-input" className="sr-only">Search returns</label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              id="returns-search-input"
              name="returns_search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SKU, Reason, AWB..."
              style={{ paddingLeft: '2.5rem' }}
              className="input-field text-xs h-9 bg-slate-900 border-slate-700"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none" data-tour="returns-status-filter">
            {['ALL', 'In Transit', 'Received', 'Restocked', 'Damaged'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {holdingCount > 0 && (
            <button
              onClick={handleBulkRestock}
              className="btn btn-success text-xs px-3.5 h-9"
              title="Restock all received return units back into inventory"
              data-tour="returns-bulk-restock"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Bulk Restock Dock ({holdingCount})</span>
            </button>
          )}

          <div className="flex items-center gap-2" data-tour="returns-export">
            <button onClick={handleExcelExport} className="btn btn-outline text-xs px-3 h-9">
              <Download className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
            <button onClick={handleCsvExport} className="btn btn-outline text-xs px-3 h-9">
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary text-xs px-3.5 h-9" data-tour="returns-add-btn">
            <Plus className="w-3.5 h-3.5" />
            <span>Log Return</span>
          </button>
        </div>
      </div>

      {/* Returns Table */}
      <div className="glass-panel overflow-hidden border border-slate-800" data-tour="returns-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 text-center">Sl. No.</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4" data-tour="returns-col-sku">Style SKU</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Refund Amount</th>
                <th className="py-3 px-4 text-right">Reverse Fee</th>
                <th className="py-3 px-4" data-tour="returns-col-reason">Primary Reason</th>
                <th className="py-3 px-4">Secondary Reason</th>
                <th className="py-3 px-4">Reverse AWB</th>
                <th className="py-3 px-4 text-center" data-tour="returns-col-status">Status</th>
                <th className="py-3 px-4 text-center">Date Received</th>
                <th className="py-3 px-4 text-center">Date Restocked</th>
                <th className="py-3 px-4 text-center" data-tour="returns-col-dock">Dock Operations</th>
                <th className="py-3 px-4 text-center" data-tour="returns-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="14" className="py-8 text-center text-slate-400">Loading customer returns...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="14" className="py-8 text-center text-slate-400">No returns matching filter.</td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{r.date}</td>
                    <td className="py-3 px-4 font-bold text-white uppercase">{r.style_no}</td>
                    <td className="py-3 px-4 text-center font-semibold text-white">{r.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(r.refund_amount)}</td>
                    <td className="py-3 px-4 text-right font-mono text-rose-300">{formatCurrency(r.reverse_fee)}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-[140px] truncate" title={r.primary_reason}>{r.primary_reason}</td>
                    <td className="py-3 px-4 text-slate-400 max-w-[140px] truncate" title={r.secondary_reason || '—'}>{r.secondary_reason || '—'}</td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{r.reverse_awb || '—'}</td>
                    <td className="py-3 px-4 text-center">{getStatusPill(r.status)}</td>
                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {r.received_date || '—'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px] text-emerald-400 whitespace-nowrap">
                      {r.restocked_date || '—'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {r.status === 'In Transit' && (
                        <button
                          onClick={() => handleReceive(r.id)}
                          className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30"
                        >
                          Mark Received
                        </button>
                      )}
                      {(r.status === 'Received' || r.status === 'Intake') && (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleRestock(r.id)}
                            className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30"
                          >
                            Restock
                          </button>
                          <button
                            onClick={() => handleDamage(r.id)}
                            className="px-2.5 py-1 rounded text-xs font-semibold bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30"
                          >
                            Damaged
                          </button>
                        </div>
                      )}
                      {r.status === 'Restocked' && (
                        <span className="text-[11px] text-emerald-400 font-mono">Restocked to Inventory</span>
                      )}
                      {r.status === 'Damaged' && (
                        <span className="text-[11px] text-rose-400 font-mono">Loss Written Off</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setQcModalReturn(r)} className="p-1 text-slate-400 hover:text-white" aria-label="Inspect QC">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="p-1 text-slate-400 hover:text-rose-400" aria-label="Delete return">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filtered.length > 0 && (() => {
              const totalQty = filtered.reduce((a, r) => a + (r.quantity || 0), 0);
              const totalRefund = filtered.reduce((a, r) => a + (r.refund_amount || 0), 0);
              const totalReverseFee = filtered.reduce((a, r) => a + (r.reverse_fee || 0), 0);

              return (
                <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-bold text-white">
                  <tr>
                    <td className="py-3 px-3 text-center text-slate-400 text-xs">—</td>
                    <td className="py-3 px-4 text-slate-300 text-xs">{filtered.length} Returns</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-center font-bold text-white text-xs">{totalQty}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-400 font-mono text-xs">{formatCurrency(totalRefund)}</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-400 font-mono text-xs">{formatCurrency(totalReverseFee)}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">-</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 text-xs">-</td>
                  </tr>
                </tfoot>
              );
            })()}
          </table>
        </div>
      </div>

      {/* Add Return Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 border border-slate-700 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-white text-base mb-4 pb-2 border-b border-slate-800">Log Customer Return & Reverse Pickup</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label htmlFor="cr-sale-select" className="text-xs text-slate-300 block mb-1 font-semibold text-purple-400">
                  ⚡ Fast Auto-Fill from Customer Sale (Optional)
                </label>
                <select
                  id="cr-sale-select"
                  className="input-field text-xs mb-1"
                  onChange={(e) => {
                    const idx = e.target.value;
                    if (idx === '') return;
                    const s = salesList[parseInt(idx, 10)];
                    if (s) {
                      setStyleNo(s.style_no || '');
                      const sQty = s.quantity_sold || 1;
                      setQuantity(sQty);
                      const sTotal = s.total_revenue || (sQty * (s.unit_price || 0));
                      setRefundAmount(Number(sTotal).toFixed(2));
                      if (s.date) setDate(s.date);
                    }
                  }}
                >
                  <option value="">-- Or enter style details manually below --</option>
                  {salesList.map((s, idx) => {
                    const uPrice = s.unit_price || (s.total_revenue / (s.quantity_sold || 1)) || 0;
                    return (
                      <option key={idx} value={idx}>
                        {s.date} • {s.style_no} ({s.quantity_sold} units @ ${Number(uPrice).toFixed(2)} = ${Number(s.total_revenue).toFixed(2)})
                      </option>
                    );
                  })}
                </select>
                <span className="text-[11px] text-slate-400 block">
                  Selecting an order auto-fills Style Number, Quantity, and Refund Amount.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="return-date" className="text-xs text-slate-300 block mb-1">Return Initiated Date *</label>
                  <input id="return-date" name="return_date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label htmlFor="return-qty" className="text-xs text-slate-300 block mb-1">Quantity *</label>
                  <input id="return-qty" name="return_qty" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="input-field" />
                </div>
              </div>
              <div>
                <label htmlFor="return-style" className="text-xs text-slate-300 block mb-1">Style SKU *</label>
                <input id="return-style" name="return_style" type="text" value={styleNo} onChange={(e) => setStyleNo(e.target.value)} placeholder="e.g. DE26003B" required className="input-field uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="return-refund" className="text-xs text-slate-300 block mb-1">Customer Refund Amount ($) *</label>
                  <input id="return-refund" name="return_refund" type="number" step="0.01" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label htmlFor="return-fee" className="text-xs text-slate-300 block mb-1">Reverse Courier Shipping Fee ($)</label>
                  <input id="return-fee" name="return_fee" type="number" step="0.01" value={reverseFee} onChange={(e) => setReverseFee(e.target.value)} className="input-field" />
                </div>
              </div>
              <div>
                <label htmlFor="return-reason" className="text-xs text-slate-300 block mb-1">Primary Return Reason *</label>
                <select id="return-reason" name="return_reason" value={primaryReason} onChange={(e) => setPrimaryReason(e.target.value)} className="input-field">
                  <option value="Size Too Small / Fit Issue">Size Too Small / Fit Issue</option>
                  <option value="Size Too Large / Fit Issue">Size Too Large / Fit Issue</option>
                  <option value="Fabric Quality Issue">Fabric Quality Issue</option>
                  <option value="Wrong Color / Style Sent">Wrong Color / Style Sent</option>
                  <option value="Received Defective Product">Received Defective Product</option>
                  <option value="Did not like the product">Did not like the product</option>
                  <option value="Don't need the product anymore">Don't need the product anymore</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="return-secondary-reason" className="text-xs text-slate-300 block mb-1">Secondary Return Reason</label>
                <input
                  id="return-secondary-reason"
                  name="return_secondary_reason"
                  type="text"
                  value={secondaryReason}
                  onChange={(e) => setSecondaryReason(e.target.value)}
                  placeholder="e.g. Customer wanted exchange for larger size"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="return-awb" className="text-xs text-slate-300 block mb-1">Reverse Courier & AWB #</label>
                <input
                  id="return-awb"
                  name="return_awb"
                  type="text"
                  value={reverseAwb}
                  onChange={(e) => setReverseAwb(e.target.value)}
                  placeholder="e.g. Delhivery AWB-9821389"
                  className="input-field"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary text-xs">Log Customer Return</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {qcModalReturn && (
        <CustomerReturnEditModal
          ret={qcModalReturn}
          isOpen={true}
          onClose={() => setQcModalReturn(null)}
          onSuccess={loadReturns}
        />
      )}
    </div>
  );
}
