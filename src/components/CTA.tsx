"use client";

import { motion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import Image from "next/image";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-blue-600" />
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-purple-600/50 to-transparent" />
      
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10 bg-white p-4 rounded-full shadow-2xl"
          >
            <Image src="/badge.png" alt="RCI Badge" width={160} height={160} className="w-32 h-32 object-contain" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-display text-white mb-6 leading-tight"
          >
            Ready to Accelerate Your Tech Career?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of successful students who have transformed their lives through our premium IT education.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#pricing"
              className="flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
            >
              Enroll Now
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 bg-black/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-black/30 transition-all w-full sm:w-auto justify-center"
            >
              <PhoneCall className="w-5 h-5" />
              Contact Admission
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
