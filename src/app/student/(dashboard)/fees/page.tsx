import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { CreditCard, CheckCircle, AlertCircle, Clock, Receipt } from "lucide-react";

export default async function StudentFeesPage() {
  const { student, supabase } = await getStudentSession();
  if (!student) redirect("/student/login");

  const { data: ledger } = await supabase
    .from("student_fees_ledger")
    .select(`
      *,
      fee_plans(plan_name, total_amount, installments_count),
      fee_transactions(id, amount_paid, payment_mode, receipt_number, paid_at)
    `)
    .eq("student_id", student.id)
    .maybeSingle();

  const plan = (ledger?.fee_plans as any);
  const transactions = (ledger?.fee_transactions as any[]) ?? [];
  const planTotal = Number(plan?.total_amount ?? 0);
  const discount = Number(ledger?.discount_amount ?? 0);
  const paid = Number(ledger?.total_paid ?? 0);
  const due = Math.max(0, planTotal - discount - paid);

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    Paid: { color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle, label: "Fully Paid" },
    Partial: { color: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock, label: "Partially Paid" },
    Unpaid: { color: "text-red-700 bg-red-50 border-red-200", icon: AlertCircle, label: "Unpaid" },
  };
  const statusKey = ledger?.status as string ?? "Unpaid";
  const status = statusConfig[statusKey] ?? statusConfig.Unpaid;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Fee Management</h1>
        <p className="text-slate-500 mt-1 text-sm">Track your fee payments, installments, and receipts.</p>
      </div>

      {!ledger ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
          <CreditCard className="w-10 h-10" />
          <p className="font-semibold">No fee record found</p>
          <p className="text-sm text-slate-300">Please contact the administration to set up your fee plan.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Fee", value: `₹${planTotal - discount}`, sub: discount > 0 ? `₹${discount} discount applied` : plan?.plan_name ?? "", color: "text-slate-700 bg-slate-50" },
              { label: "Amount Paid", value: `₹${paid}`, sub: `${transactions.length} transaction(s)`, color: "text-emerald-700 bg-emerald-50" },
              { label: "Balance Due", value: `₹${due}`, sub: due > 0 ? "Pending payment" : "Fully settled!", color: due > 0 ? "text-red-700 bg-red-50" : "text-emerald-700 bg-emerald-50" },
              { label: "Status", value: status.label, sub: `${plan?.installments_count ?? 1} installment plan`, color: status.color },
            ].map((card) => (
              <div key={card.label} className={`rounded-2xl border p-5 ${card.color}`}>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">{card.label}</p>
                <p className="text-xl font-bold font-display">{card.value}</p>
                <p className="text-xs mt-1 opacity-60">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-900">Payment Progress</h3>
              <span className="text-sm font-bold text-indigo-600">{planTotal > 0 ? Math.round((paid / (planTotal - discount)) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${planTotal > 0 ? Math.min(100, Math.round((paid / Math.max(1, planTotal - discount)) * 100)) : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>Paid: ₹{paid}</span>
              <span>Total: ₹{planTotal - discount}</span>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-slate-900">Transaction History</h3>
            </div>
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-400 gap-2 text-sm">
                <Receipt className="w-6 h-6" />
                No payments recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.sort((a: any, b: any) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime()).map((t: any) => (
                  <div key={t.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-sm">₹{t.amount_paid}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t.payment_mode} • Receipt: <span className="font-mono text-slate-700">{t.receipt_number}</span>
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 shrink-0">
                      {new Date(t.paid_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
