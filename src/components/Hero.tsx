"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 overflow-hidden bg-slate-50">
      {/* Background Gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 mb-8 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-slate-700">
            Admissions open for 2026 Batch
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold font-display text-slate-900 mb-6 leading-tight tracking-tight"
        >
          Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Digital World</span>
          <br /> at <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Rohit Computer Institute (RCI). </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10"
        >
          Rohit Computer Institute provides premium, industry-aligned tech education. 
          Build your career with expert faculty, modern labs, and 100% placement assistance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="#pricing"
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center shadow-lg shadow-blue-500/25"
          >
            Explore Courses
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#features"
            className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-semibold hover:bg-slate-50 transition-all w-full sm:w-auto justify-center shadow-sm"
          >
            Why Choose Us
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-slate-200/50 bg-white"
        >
          <Image 
            src="/banner.png" 
            alt="RCI Promotional Banner" 
            width={1200} 
            height={600} 
            className="w-full h-auto object-cover" 
            priority
          />
        </motion.div>

        {/* Stats / Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-200 pt-10"
        >
          {[
            { label: "Students Placed", value: "500+" },
            { label: "Expert Instructors", value: "20+" },
            { label: "Success Rate", value: "98%" },
            { label: "Premium Labs", value: "24/7" },
          ].map((stat, i) => (
             <div key={i} className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
