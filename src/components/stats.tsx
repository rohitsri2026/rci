import { Users, BookOpen, Award, Calendar } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "1,500+",
    label: "Students Trained",
    description: "Enrolled & trained across various IT programs",
  },
  {
    icon: BookOpen,
    number: "25+",
    label: "Professional Courses",
    description: "Diplomas, accounting & tech certifications",
  },
  {
    icon: Award,
    number: "1,200+",
    label: "Certificates Issued",
    description: "Fully verifiable online & QR code enabled",
  },
  {
    icon: Calendar,
    number: "5+ Years",
    label: "Experience",
    description: "Empowering computer students since establishment",
  },
];

export default function Stats() {
  return (
    <section className="py-16 sm:py-18 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6 text-center hover:border-blue-300 hover:bg-blue-50/20 transition-all group"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-100/80 text-blue-600 mx-auto flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <item.icon className="w-5.5 h-5.5" />
              </div>

              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-1 tracking-tight font-display">
                {item.number}
              </h3>

              <p className="text-xs sm:text-sm font-extrabold text-slate-800 mb-1">
                {item.label}
              </p>

              <p className="text-xs text-slate-500 line-clamp-2">
                {item.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
