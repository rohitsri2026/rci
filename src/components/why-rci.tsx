import { Monitor, ShieldCheck, GraduationCap, QrCode } from "lucide-react";

const differentiators = [
  {
    icon: Monitor,
    title: "100% Practical Computer Practice",
    description: "Daily hands-on lab sessions on individual desktop computers to master MS Office, Tally Prime, Web Design, and Programming.",
  },
  {
    icon: ShieldCheck,
    title: "Government MSME Registered Institute",
    description: "Recognized institute quality standards ensuring your computer diploma and certificate hold official institutional trust.",
  },
  {
    icon: GraduationCap,
    title: "Digital Student Portal Access",
    description: "Every student gets a dedicated account at /student/login to monitor attendance, fee ledgers, exam results, and study files.",
  },
  {
    icon: QrCode,
    title: "Instant QR Certificate Verification",
    description: "Certificates feature unique ID numbers and QR codes that employers and institutions can authenticate online instantly at /verify.",
  },
];

export default function WhyRCI() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Institutional Distinction
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 mt-3 mb-3">
            What Makes RCI Different
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            We combine practical IT instruction with modern digital management for an unmatched learning experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {differentiators.map((diff, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-3xl p-7 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <diff.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                  {diff.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {diff.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
