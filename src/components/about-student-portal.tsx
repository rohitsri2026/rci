import Link from "next/link";
import { GraduationCap, CreditCard, CalendarCheck, Award, FileText, Bell, Download, ArrowRight } from "lucide-react";

const features = [
  { icon: CreditCard, title: "Fee Ledger & Receipts", desc: "Track installment payments & download official payment receipts." },
  { icon: CalendarCheck, title: "Lab Attendance Tracker", desc: "Monitor daily attendance records for practical lab classes." },
  { icon: FileText, title: "Exam Results & Marks", desc: "View official test performance reports, grades & marks." },
  { icon: Award, title: "Digital Certificates", desc: "Download verified QR-enabled course completion certificates." },
  { icon: Bell, title: "Institute Notices", desc: "Receive instant notifications for exams, holidays & class shifts." },
  { icon: Download, title: "Study Materials", desc: "Download lab practice guides, syllabus notes & exercise files." },
];

export default function AboutStudentPortal() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-950 border border-blue-800/80 px-3.5 py-1.5 rounded-full">
            Digital Campus Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white mt-3 mb-3">
            Integrated RCI Student Portal
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Every student receives 24/7 digital access to track academic progress, fees, and certificates.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-3xl hover:bg-slate-800 hover:border-blue-500/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white mb-1">{feat.title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/student/login"
            className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-lg shadow-blue-600/25 active:scale-98"
          >
            <GraduationCap className="w-4.5 h-4.5" />
            Explore Student Portal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
