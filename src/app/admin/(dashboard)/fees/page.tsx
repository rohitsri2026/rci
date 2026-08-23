"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Receipt,
  Plus,
  Loader2,
  ListFilter
} from "lucide-react";

export default function FeesDashboardPage() {
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Payment dialog state
  const [activeLedger, setActiveLedger] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({ amount: "", mode: "UPI" });
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Transactions drawer state
  const [drawerLedger, setDrawerLedger] = useState<any>(null);

  const fetchLedgers = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/admin/fees", window.location.origin);
      if (statusFilter) url.searchParams.set("status", statusFilter);
      if (search) url.searchParams.set("query", search);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setLedgers(data);
      }
    } catch (e) {
      console.error("Failed to load fees logs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLedgers();
  }, [search, statusFilter]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLedger) return;
    
    setSubmittingPayment(true);
    setActionError("");
    setActionSuccess("");

    try {
      const res = await fetch("/api/admin/fees/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ledger_id: activeLedger.id,
          amount_paid: Number(paymentForm.amount),
          payment_mode: paymentForm.mode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error || "Failed to record transaction.");
      } else {
        setActionSuccess(`Successfully recorded payment of ₹${paymentForm.amount}. Receipt: ${data.transaction.receipt_number}`);
        setPaymentForm({ amount: "", mode: "UPI" });
        setActiveLedger(null);
        fetchLedgers();
      }
    } catch (err: any) {
      setActionError("Error: " + err.message);
    } finally {
      setSubmittingPayment(false);
    }
  };

  // Compute metrics
  const totalRevenue = ledgers.reduce((sum, l) => {
    const transSum = l.fee_transactions?.reduce((tSum: number, t: any) => tSum + Number(t.amount_paid), 0) || 0;
    return sum + transSum;
  }, 0);

  const totalOutstanding = ledgers.reduce((sum, l) => {
    const planTotal = Number(l.fee_plans?.total_amount) || Number(l.students?.courses?.fees) || 0;
    const discount = Number(l.discount_amount) || 0;
    const paid = Number(l.total_paid) || 0;
    return sum + (planTotal - discount - paid);
  }, 0);

  const stats = [
    { label: "Total Revenue Collected", value: `₹${totalRevenue}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Total Outstanding Dues", value: `₹${totalOutstanding}`, icon: AlertCircle, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { label: "Active Invoices", value: ledgers.length, icon: CreditCard, color: "text-blue-600 bg-blue-50 border-blue-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Fee Ledger Management</h1>
          <p className="text-slate-500 mt-1">Manage payment installments, issue receipts, and monitor outstanding dues.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border bg-white shadow-sm flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 font-display">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and search bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, or phone number..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-slate-700 text-sm font-semibold">
            <ListFilter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger lists */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold">
          {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold">
          {actionError}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-slate-400 text-sm">Querying ledgers...</p>
          </div>
        ) : ledgers.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-slate-400 gap-2">
            <CreditCard className="w-8 h-8" />
            <p className="text-sm">No fee records found matching requirements.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course Details</th>
                  <th className="px-6 py-4">Plan Total</th>
                  <th className="px-6 py-4">Paid</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {ledgers.map((ledger) => {
                  const courseName = ledger.students?.courses?.course_name || "N/A";
                  const planTotal = Number(ledger.fee_plans?.total_amount) || Number(ledger.students?.courses?.fees) || 0;
                  const discount = Number(ledger.discount_amount) || 0;
                  const due = planTotal - discount;
                  const paid = Number(ledger.total_paid) || 0;
                  const balance = due - paid;

                  return (
                    <tr key={ledger.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{ledger.students?.full_name}</p>
                        <p className="text-xs text-slate-450 mt-0.5">{ledger.students?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-semibold">{courseName}</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold">₹{due}</td>
                      <td className="px-6 py-4 font-mono text-emerald-600">₹{paid}</td>
                      <td className="px-6 py-4 font-mono text-slate-900">₹{balance}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          ledger.status === "Paid" 
                            ? "bg-emerald-50 text-emerald-700" 
                            : ledger.status === "Partial"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {ledger.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setDrawerLedger(ledger)}
                          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors inline-flex items-center gap-1 text-xs"
                        >
                          <Receipt className="w-3.5 h-3.5" /> History
                        </button>
                        {balance > 0 && (
                          <button
                            onClick={() => {
                              setActiveLedger(ledger);
                              setPaymentForm({ amount: balance.toString(), mode: "UPI" });
                            }}
                            className="bg-purple-600 text-white hover:bg-purple-750 font-bold px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 text-xs shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" /> Collect
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Dialog */}
      {activeLedger && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 text-sm">
            <h3 className="text-lg font-bold text-slate-950 mb-1">Record Payment Installment</h3>
            <p className="text-xs text-slate-450 mb-4">Record transaction voucher for {activeLedger.students?.full_name}.</p>
            
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount Paid (₹)</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  placeholder="e.g. 2000"
                  className="w-full border border-slate-250 rounded-xl px-4 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-950 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                <select
                  value={paymentForm.mode}
                  onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                  className="w-full border border-slate-250 rounded-xl px-4 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-950 font-bold"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="NetBanking">NetBanking</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setActiveLedger(null)}
                  className="text-slate-650 hover:text-slate-900 hover:bg-slate-100 font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="bg-purple-600 text-white hover:bg-purple-750 font-bold px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {submittingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Recording...
                    </>
                  ) : "Confirm & Send SMS"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction History Drawer */}
      {drawerLedger && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white border-l border-slate-200 w-full max-w-lg p-6 flex flex-col h-full shadow-2xl text-sm">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Transaction Ledger History</h3>
                <p className="text-xs text-slate-450 mt-0.5">Voucher listing for {drawerLedger.students?.full_name}.</p>
              </div>
              <button
                onClick={() => setDrawerLedger(null)}
                className="text-slate-400 hover:text-slate-900 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {(!drawerLedger.fee_transactions || drawerLedger.fee_transactions.length === 0) ? (
                <div className="flex flex-col justify-center items-center h-48 text-slate-400 gap-2">
                  <Receipt className="w-8 h-8" />
                  <p className="text-xs font-semibold">No payments recorded for this ledger.</p>
                </div>
              ) : (
                drawerLedger.fee_transactions.map((t: any) => (
                  <div key={t.id} className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-base">₹{t.amount_paid}</span>
                      <span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">{t.payment_mode}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Receipt: <strong className="text-slate-700">{t.receipt_number}</strong></span>
                      <span>{new Date(t.paid_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4">
              <button
                onClick={() => setDrawerLedger(null)}
                className="w-full bg-slate-100 text-slate-800 hover:bg-slate-200 font-bold py-2.5 rounded-xl transition-colors"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
