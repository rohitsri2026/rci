"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ChevronRight, CreditCard, Award } from "lucide-react";

interface AttentionPanelProps {
  remainingFee?: number;
  hasCertificates?: boolean;
}

export default function AttentionPanel({ remainingFee = 0, hasCertificates = false }: AttentionPanelProps) {
  const needsFeeAttention = remainingFee > 0;

  if (!needsFeeAttention && !hasCertificates) {
    return (
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-800 text-xs sm:text-sm font-semibold">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>You&apos;re all caught up! No urgent actions pending for your student account.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-display">
        Attention Required
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {needsFeeAttention && (
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <CreditCard className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 text-xs">
                <h4 className="font-extrabold text-amber-950 truncate font-display">Fee Payment Pending</h4>
                <p className="text-amber-800/90 font-medium truncate mt-0.5">
                  Remaining balance: ₹{remainingFee.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <Link
              href="/student/fees"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shrink-0 transition-colors min-h-[44px]"
            >
              <span>View Fee</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {hasCertificates && (
          <div className="bg-blue-50/80 border border-blue-200/90 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Award className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 text-xs">
                <h4 className="font-extrabold text-blue-950 truncate font-display">Certificate Available</h4>
                <p className="text-blue-800/90 font-medium truncate mt-0.5">
                  Your official RCI certificate is ready.
                </p>
              </div>
            </div>

            <Link
              href="/student/certificates"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-xs shrink-0 transition-colors min-h-[44px]"
            >
              <span>View Certificate</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
