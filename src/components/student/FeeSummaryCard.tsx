"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, FileText, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";

interface FeeSummaryCardProps {
  ledger?: {
    status?: string | null;
    total_paid?: number | null;
    discount_amount?: number | null;
    fee_plans?: {
      total_amount?: number | null;
    } | null;
  } | null;
}

export default function FeeSummaryCard({ ledger }: FeeSummaryCardProps) {
  // Case A: Ledger record exists in database
  const hasLedger = ledger !== null && ledger !== undefined;

  let totalCourseFee = 0;
  let paidAmount = 0;
  let remainingFee = 0;
  let feeStatus = "Pending";

  if (hasLedger) {
    const planTotal = Number(ledger?.fee_plans?.total_amount ?? 0);
    const discount = Number(ledger?.discount_amount ?? 0);
    paidAmount = Number(ledger?.total_paid ?? 0);
    totalCourseFee = Math.max(0, planTotal - discount);
    remainingFee = Math.max(0, totalCourseFee - paidAmount);

    feeStatus = ledger?.status || (remainingFee === 0 && totalCourseFee > 0 ? "Paid" : remainingFee > 0 && paidAmount > 0 ? "Partially Paid" : "Pending");
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PARTIALLY PAID":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "OVERDUE":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-950 tracking-tight font-display">
                Fee Ledger Summary
              </h3>
              <p className="text-xs text-slate-500 font-medium">Payment status and remaining balance</p>
            </div>
          </div>

          {hasLedger && (
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase border shrink-0 ${getStatusBadgeStyle(feeStatus)}`}>
              {feeStatus}
            </span>
          )}
        </div>

        {/* CASE A: Ledger Data Exists */}
        {hasLedger ? (
          <div className="mt-4 grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Total Fee
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-1 block">
                ₹{totalCourseFee.toLocaleString("en-IN")}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                Paid
              </span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-700 mt-1 block">
                ₹{paidAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 block">
                Remaining
              </span>
              <span className="text-sm sm:text-base font-extrabold text-rose-700 mt-1 block">
                ₹{remainingFee.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        ) : (
          /* CASE B: No Fee Record Exists (Clean Empty State) */
          <div className="mt-4 bg-slate-50 rounded-2xl p-6 text-center space-y-2">
            <CreditCard className="w-7 h-7 text-slate-400 mx-auto" />
            <h4 className="text-xs font-extrabold text-slate-800">No fee transactions recorded yet</h4>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
              Your fee plan and payment installments will appear here once recorded by RCI administration.
            </p>
          </div>
        )}
      </div>

      <div className="pt-2">
        <Link
          href="/student/fees"
          className="w-full min-h-[44px] bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/90 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>View Complete Fee Ledger</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </div>
  );
}
