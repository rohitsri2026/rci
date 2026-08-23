"use client";

import { motion } from "framer-motion";
import { BookOpen, ClipboardCheck, UserCheck, Laptop, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Choose Your Course",
    description: "Explore our industry-aligned diplomas, accounting, and computer programming courses.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Submit Admission Form",
    description: "Fill out the quick online application form or visit our institute campus.",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Get Admission Approved",
    description: "Our counselor confirms your batch timing, course schedule, and installment fee plan.",
    icon: UserCheck,
  },
  {
    number: "04",
    title: "Start Learning & Access Portal",
    description: "Begin computer lab training and unlock your student digital portal credentials.",
    icon: Laptop,
  },
];

export default function AdmissionWorkflow() {
  return (
    <section className="py-18 bg-white relative border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 mt-4 mb-4 leading-tight">
            How Admission Works
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Four easy steps to start your technical education journey at Rohit Computer Institute.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-slate-50/80 border border-slate-200/80 rounded-3xl p-8 hover:bg-white hover:border-blue-300 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-300 group-hover:text-blue-600 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-slate-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/admission"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-blue-500/25 active:scale-98"
          >
            Start Your Application Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
