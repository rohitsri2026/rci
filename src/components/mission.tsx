import { Eye, Target } from "lucide-react";

export default function Mission() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Core Philosophy
          </span>
          <h2 className="text-3xl font-black font-display text-slate-900 mt-3">
            Our Vision & Mission
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Vision Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-display text-slate-900 mb-3">
                Our Vision
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                To become one of the most trusted and recognized computer education institutes by delivering high-quality technical training, 
                fostering digital literacy, and empowering students with career-oriented IT skills.
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-display text-slate-900 mb-3">
                Our Mission
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                To provide accessible, affordable, and practical computer education that bridges the gap between academic learning and real-world 
                industry software requirements for every student.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
