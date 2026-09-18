import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Wallet,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { BankEditModal } from '../modals/EditModals';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function BankView() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTx, setEditingTx] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'credit' | 'debit'
  const [search, setSearch] = useState('');

  // New bank form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('Credited (+)');
  const [amount, setAmount] = useState('');

  const loadData = () => {
    setLoading(true);
    api.getBank()
      .then((data) => setTransactions(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete bank transaction and recalculate all balances?')) return;
    try {
      await api.deleteBank(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createBank({
        date,
        type,
        amount: parseFloat(amount),
      });
      setShowAddModal(false);
      setAmount('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const currentBalance = transactions.length > 0 ? transactions[transactions.length - 1].running_balance : 0.0;
  const isBalancePositive = currentBalance >= 0;

  const creditedTx = transactions.filter((t) => (t.type || '').includes('Credit') || (t.type || '').includes('(+)'));
  const debitedTx = transactions.filter((t) => (t.type || '').includes('Debit') || (t.type || '').includes('(-)'));

  const totalCredited = creditedTx.reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalDebited = debitedTx.reduce((acc, t) => acc + (t.amount || 0), 0);

  const filtered = transactions.filter((t) => {
    const isCredit = (t.type || '').includes('Credit') || (t.type || '').includes('(+)');
    if (typeFilter === 'credit' && !isCredit) return false;
    if (typeFilter === 'debit' && isCredit) return false;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchDate = (t.date || '').toLowerCase().includes(q);
      const matchType = (t.type || '').toLowerCase().includes(q);
      const matchAmt = String(t.amount || '').includes(q);
      return matchDate || matchType || matchAmt;
    }
    return true;
  });

  const handleExcelExport = () => {
    const formatted = filtered.map((t) => ({
      'Sl No': t.sl_no,
      Date: t.date,
      Type: t.type,
      'Amount ($)': t.amount,
      'Running Balance ($)': t.running_balance,
    }));
    exportToExcel(formatted, `Bank_Statement_${new Date().toISOString().split('T')[0]}.xlsx`, 'Bank Ledger');
  };

  const handleCsvExport = () => {
    exportToCSV(filtered, `bank_statement_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* 4-Card Bank Reconciliation HUD matching localhost:5001 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Bank Balance */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span className="flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>Current Bank Balance</span>
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
              isBalancePositive
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/25'
            }`}>
              {isBalancePositive ? 'Active' : 'Deficit / Overdrawn'}
            </span>
          </div>

          <div className={`text-2xl sm:text-3xl font-bold tracking-tight font-heading mt-1 ${
            isBalancePositive ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {formatCurrency(currentBalance)}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
            <span>Net Realized Account Inflow</span>
            <span className="text-slate-400 font-mono text-[11px]">Live Statement</span>
          </div>
        </div>

        {/* Card 2: Total Credited */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>Total Credited</span>
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/25">
              + Inflow
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight font-heading mt-1">
            {formatCurrency(totalCredited)}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
            <span>{creditedTx.length} credit entries</span>
            <span className="text-slate-400 font-mono text-[11px]">Total Deposits</span>
          </div>
        </div>

        {/* Card 3: Total Debited */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              <span>Total Debited</span>
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/25">
              - Outflow
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-bold text-rose-400 tracking-tight font-heading mt-1">
            {formatCurrency(totalDebited)}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
            <span>{debitedTx.length} debit entries</span>
            <span className="text-slate-400 font-mono text-[11px]">Total Withdrawals</span>
          </div>
        </div>

        {/* Card 4: Total Transactions */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-purple-400" />
              <span>Total Transactions</span>
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/25">
              Ledger
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-heading mt-1">
            {transactions.length}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
            <span>Synced & Normalized</span>
            <span className="text-slate-400 font-mono text-[11px]">CSV & Excel</span>
          </div>
        </div>
      </div>

      {/* Toolbar with Search, Filter Pills & Actions */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="relative w-full sm:w-64">
            <label htmlFor="bank-search-input" className="sr-only">Search transactions</label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              id="bank-search-input"
              name="bank_search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search date, type, amount..."
              style={{ paddingLeft: '2.5rem' }}
              className="input-field text-xs h-9 bg-slate-900 border-slate-700"
            />
          </div>

          {/* Filter Pills matching reference */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All ({transactions.length})
            </button>

            <button
              onClick={() => setTypeFilter('credit')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === 'credit'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900/80 text-emerald-400 hover:text-white border border-slate-800'
              }`}
            >
              🟢 Credited ({creditedTx.length})
            </button>

            <button
              onClick={() => setTypeFilter('debit')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === 'debit'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-900/80 text-rose-400 hover:text-white border border-slate-800'
              }`}
            >
              🔴 Debited ({debitedTx.length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button onClick={handleExcelExport} className="btn btn-outline text-xs px-3 h-9">
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button onClick={handleCsvExport} className="btn btn-outline text-xs px-3 h-9">
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary text-xs px-3.5 h-9">
            <Plus className="w-3.5 h-3.5" />
            <span>Record Bank Entry</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Transaction Type</th>
                <th className="py-3 px-4 text-right">Amount ($)</th>
                <th className="py-3 px-4 text-right">Closing Running Balance ($)</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">Loading bank ledger...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">No transactions match your filter criteria.</td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const isCredit = (t.type || '').includes('Credit') || (t.type || '').includes('(+)');
                  return (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{t.sl_no}</td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono">{t.date}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                          isCredit
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/25'
                        }`}>
                          {isCredit ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {t.type}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-right font-bold font-mono ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isCredit ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${
                        t.running_balance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {formatCurrency(t.running_balance)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingTx(t)}
                            className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-white/5 transition-colors"
                            title="Edit Bank Transaction"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                            title="Delete Bank Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 border border-slate-700">
            <h3 className="font-bold text-white text-base mb-4 pb-2 border-b border-slate-800">
              Record Bank Statement Entry
            </h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label htmlFor="bank-date" className="text-xs text-slate-300 block mb-1">Date</label>
                <input
                  id="bank-date"
                  name="bank_date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="bank-type" className="text-xs text-slate-300 block mb-1">Transaction Type</label>
                <select
                  id="bank-type"
                  name="bank_type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="input-field"
                >
                  <option value="Credited (+)">Credited (+) - Inflow / Deposit</option>
                  <option value="Debited (-)">Debited (-) - Outflow / Withdrawal</option>
                </select>
              </div>

              <div>
                <label htmlFor="bank-amount" className="text-xs text-slate-300 block mb-1">Amount ($)</label>
                <input
                  id="bank-amount"
                  name="bank_amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="e.g. 500.00"
                  className="input-field"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTx && (
        <BankEditModal
          transaction={editingTx}
          isOpen={true}
          onClose={() => setEditingTx(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
