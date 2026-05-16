"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Aman Gupta",
    role: "Full Stack Developer at TCS",
    content: "RCI's web development course completely transformed my career. The hands-on projects and placement support helped me secure my first job as a software engineer within weeks of graduation.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Data Analyst",
    content: "The expert faculty at Rohit Computer Institute taught me not just the tools, but how to think like an engineer. The curriculum is perfectly aligned with what the tech industry needs today.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "IT Consultant",
    content: "I started with zero coding knowledge. The basic IT and advanced diploma courses gave me the confidence to handle complex tech challenges. Highly recommended!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-6">
            Student Success Stories
          </h2>
          <p className="text-slate-600 text-lg">
            Don't just take our word for it. Hear what our alumni have to say about their experience at RCI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm"
            >
              <Quote className="w-10 h-10 text-blue-100 mb-6" />
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-8 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold">{testimonial.name}</h4>
                  <p className="text-slate-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
