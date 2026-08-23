import Link from "next/link";
import { Award, ShieldCheck, QrCode, ArrowRight } from "lucide-react";

export default function AboutCertTrust() {
  return (
    <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-blue-50/50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">

        <div className="space-y-4 text-center md:text-left">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Verifiable Credentials
          </span>

          <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 leading-snug">
            Secure Online Certificate Verification
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
            Every diploma and completion certificate issued by Rohit Computer Institute contains a unique Certificate ID
            and a scannable QR code allowing instant authentication by employers and government bodies.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-slate-700 pt-1">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Award className="w-4 h-4 text-blue-600" />
              Certificate ID Lookup
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <QrCode className="w-4 h-4 text-purple-600" />
              QR Code Scanner Support
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto text-center">
          <Link
            href="/verify"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98"
          >
            <Award className="w-4 h-4" />
            Verify Certificate
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
