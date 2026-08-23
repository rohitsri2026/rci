"use client";

import { motion } from "framer-motion";
import { Monitor, Cpu, Code2, Users, Compass, Award } from "lucide-react";

const featureCards = [
  {
    title: "Modern Computer Labs",
    description: "Equipped with high-performance desktop systems, fast internet, and practical software environments.",
    icon: Monitor,
  },
  {
    title: "Industry-Oriented Curriculum",
    description: "Updated course modules covering software tools, accounting standards, and modern programming.",
    icon: Cpu,
  },
  {
    title: "Hands-on Training",
    description: "Daily practical sessions focused on building real-world software skills and portfolio projects.",
    icon: Code2,
  },
  {
    title: "Expert Faculty",
    description: "Learn directly from experienced instructors with years of domain expertise in IT and computer applications.",
    icon: Users,
  },
  {
    title: "Career Guidance",
    description: "Personalized assistance including resume building, interview practice, and employment guidance.",
    icon: Compass,
  },
  {
    title: "Verified Certification",
    description: "Earn QR-enabled certificates registered with MSME standards that employers can instantly verify.",
    icon: Award,
  },
];

export default function WhyRCI() {
  return (
    <section id="why-rci" className="py-18 bg-slate-50 relative border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
            The RCI Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 mt-4 mb-4 leading-tight">
            Why Choose Rohit Computer Institute?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            We focus on skill mastery and hands-on practice so every student gains genuine technical confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
