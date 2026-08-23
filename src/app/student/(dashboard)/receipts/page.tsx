import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { Receipt, CheckCircle } from "lucide-react";

export default async function StudentReceiptsPage() {
  const { student, supabase } = await getStudentSession();
  if (!student) redirect("/student/login");

  // Get ledger IDs for this student
  const { data: ledgers } = await supabase
    .from("student_fees_ledger")
    .select("id")
    .eq("student_id", student.id);

  const ledgerIds = (ledgers ?? []).map((l: any) => l.id);

  const { data: transactions } = ledgerIds.length > 0
    ? await supabase
        .from("fee_transactions")
        .select("*")
        .in("ledger_id", ledgerIds)
        .order("paid_at", { ascending: false })
    : { data: [] };

  const modeColors: Record<string, string> = {
    UPI: "bg-purple-50 text-purple-700 border-purple-200",
    Cash: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Card: "bg-blue-50 text-blue-700 border-blue-200",
    NetBanking: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Payment Receipts</h1>
        <p className="text-slate-500 mt-1 text-sm">All fee payment receipts and vouchers.</p>
      </div>

      {(!transactions || transactions.length === 0) ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
          <Receipt className="w-10 h-10" />
          <p className="font-semibold">No receipts found</p>
          <p className="text-sm text-slate-300">Your payment receipts will appear here once you make a payment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {transactions.map((t: any) => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-900 text-lg font-display">₹{t.amount_paid}</p>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${modeColors[t.payment_mode] ?? "bg-slate-50 text-slate-700 border-slate-200"}`}>
                    {t.payment_mode}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Receipt No: <span className="font-mono font-bold text-slate-700">{t.receipt_number}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(t.paid_at).toLocaleDateString("en-IN", { dateStyle: "long" })} at {new Date(t.paid_at).toLocaleTimeString("en-IN", { timeStyle: "short" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {transactions && transactions.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600">
          Total paid: <strong className="text-slate-900">₹{transactions.reduce((sum: number, t: any) => sum + Number(t.amount_paid), 0)}</strong> across {transactions.length} transaction(s).
        </div>
      )}
    </div>
  );
}
