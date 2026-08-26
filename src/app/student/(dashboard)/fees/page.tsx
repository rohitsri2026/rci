import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { CreditCard, CheckCircle, AlertCircle, Clock, Receipt, ShieldCheck } from "lucide-react";

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
  const totalCourseFee = Math.max(0, planTotal - discount);
  const due = Math.max(0, totalCourseFee - paid);

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    Paid: { color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle, label: "PAID" },
    Partial: { color: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock, label: "PARTIALLY PAID" },
    Unpaid: { color: "text-rose-700 bg-rose-50 border-rose-200", icon: AlertCircle, label: "PENDING" },
  };
  const statusKey = ledger?.status as string ?? (due === 0 && totalCourseFee > 0 ? "Paid" : paid > 0 ? "Partial" : "Unpaid");
  const status = statusConfig[statusKey] ?? statusConfig.Unpaid;

  const percentPaid = totalCourseFee > 0 ? Math.min(100, Math.round((paid / totalCourseFee) * 100)) : 0;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-[#07152F] font-display">Fee Ledger</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">Track your course fee payments, balance, and official institute receipts.</p>
      </div>

      {!ledger ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-12 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-2xs">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg font-display">No Fee Ledger Assigned</h3>
          <p className="text-xs text-slate-500 max-w-sm font-medium">
            Please contact RCI institute administration desk to assign your course fee plan.
          </p>
        </div>
      ) : (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Fee", value: `₹${totalCourseFee.toLocaleString("en-IN")}`, sub: discount > 0 ? `₹${discount} discount applied` : plan?.plan_name ?? "Standard Plan", color: "text-slate-900 bg-white border-slate-200" },
              { label: "Amount Paid", value: `₹${paid.toLocaleString("en-IN")}`, sub: `${transactions.length} transaction(s)`, color: "text-emerald-700 bg-emerald-50/70 border-emerald-200" },
              { label: "Balance Due", value: `₹${due.toLocaleString("en-IN")}`, sub: due > 0 ? "Pending payment" : "Fully settled!", color: due > 0 ? "text-rose-700 bg-rose-50/70 border-rose-200" : "text-emerald-700 bg-emerald-50/70 border-emerald-200" },
              { label: "Payment Status", value: status.label, sub: `${plan?.installments_count ?? 1} installment plan`, color: status.color },
            ].map((card) => (
              <div key={card.label} className={`rounded-2xl border p-5 shadow-2xs ${card.color}`}>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider opacity-70 mb-1">{card.label}</p>
                <p className="text-xl sm:text-2xl font-extrabold font-display">{card.value}</p>
                <p className="text-xs mt-1 opacity-70 font-semibold">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Progress Meter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-950 text-base font-display">Payment Progress</h3>
              <span className="text-sm font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                {percentPaid}% Paid
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="bg-[#155EEF] h-full rounded-full transition-all duration-500"
                style={{ width: `${percentPaid}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-bold pt-1">
              <span>Paid: ₹{paid.toLocaleString("en-IN")}</span>
              <span>Total: ₹{totalCourseFee.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-950 text-base font-display">Transaction History</h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {transactions.length} record(s)
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-slate-400 gap-2 text-xs font-semibold">
                <Receipt className="w-8 h-8 text-slate-300" />
                <span>No fee payments recorded yet.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.sort((a: any, b: any) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime()).map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-950 text-sm">₹{Number(t.amount_paid).toLocaleString("en-IN")}</p>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          Mode: <strong className="text-slate-800">{t.payment_mode || "Cash"}</strong> • Receipt: <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{t.receipt_number}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-500 shrink-0">
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
