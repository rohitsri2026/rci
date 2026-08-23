"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Award, Calendar } from "lucide-react";

const metrics = [
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
    label: "Excellence in Training",
    description: "Empowering computer students since establishment",
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-white border-y border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-6 sm:p-8 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-blue-600 mx-auto flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-1 tracking-tight">
                {item.number}
              </h3>
              <p className="text-sm font-bold text-slate-800 mb-1">{item.label}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
