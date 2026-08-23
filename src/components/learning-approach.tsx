import { Laptop, Code, Award, Users } from "lucide-react";

const approaches = [
  {
    icon: Laptop,
    title: "100% Practical Lab Training",
    description: "Every student gets dedicated computer lab desktop practice time to perform hands-on software exercises rather than just reading textbooks.",
  },
  {
    icon: Code,
    title: "Hands-on Project Exercises",
    description: "Students work on actual accounting vouchers, web coding, DTP layouts, and typing drills to build genuine workplace confidence.",
  },
  {
    icon: Award,
    title: "Industry-Aligned Curriculum",
    description: "Our course modules for DCA, Tally Prime, Web Development, and Python are regularly updated to match modern job requirements.",
  },
  {
    icon: Users,
    title: "Student Portal & Support",
    description: "Enrolled students enjoy 24/7 access to our digital portal (/student/login) for fee ledgers, exam marks, and study material downloads.",
  },
];

export default function LearningApproach() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Educational Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 mt-3 mb-3">
            RCI&apos;s Practical Learning Approach
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            We focus on skill mastery, hands-on computer practice, and continuous digital support so every student succeeds.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {approaches.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <item.icon className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
