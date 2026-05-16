"use client";

import { motion } from "framer-motion";
import { Monitor, Cpu, Code2, Users, Briefcase, Award } from "lucide-react";

const features = [
  {
    title: "Modern Computer Labs",
    description: "Practice on the latest hardware with high-speed internet in our fully equipped labs.",
    icon: Monitor,
  },
  {
    title: "Industry-Aligned Curriculum",
    description: "Learn technologies and skills that top employers are actively looking for today.",
    icon: Cpu,
  },
  {
    title: "Hands-on Coding",
    description: "Build real-world projects and develop a portfolio that stands out to recruiters.",
    icon: Code2,
  },
  {
    title: "Expert Faculty",
    description: "Learn directly from experienced professionals with years of industry background.",
    icon: Users,
  },
  {
    title: "Placement Assistance",
    description: "100% job assistance including resume building, mock interviews, and direct referrals.",
    icon: Briefcase,
  },
  {
    title: "Recognized Certification",
    description: "Earn certificates that are widely accepted and add immense value to your profile.",
    icon: Award,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-6">
            Why Choose RCI?
          </h2>
          <p className="text-slate-600 text-lg">
            We don't just teach technology; we build tech careers. Here is what makes our institute the right choice for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
