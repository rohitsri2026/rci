"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic IT",
    price: "₹3,999",
    duration: "3 Months",
    description: "Perfect for beginners looking to build a strong foundation in computer basics.",
    features: [
      "MS Office (Word, Excel, PowerPoint)",
      "Internet & Email Fundamentals",
      "Typing Skills (English & Hindi)",
      "Basic Hardware Troubleshooting",
      "Course Certificate",
    ],
    popular: false,
  },
  {
    name: "Advanced Web Dev",
    price: "₹14,999",
    duration: "6 Months",
    description: "Comprehensive training to become a full-stack web developer.",
    features: [
      "HTML, CSS, JavaScript Basics",
      "React.js & Next.js Frameworks",
      "Node.js & Database Management",
      "3 Real-world Live Projects",
      "Guaranteed Placement Assistance",
    ],
    popular: true,
  },
  {
    name: "Master Diploma (DCA)",
    price: "₹9,999",
    duration: "1 Year",
    description: "Complete diploma program covering all essential computing aspects.",
    features: [
      "Advanced Programming (C, C++, Python)",
      "Financial Accounting (Tally Prime)",
      "Desktop Publishing (DTP)",
      "Web Designing Basics",
      "Govt. Recognized Diploma",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50 relative border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-6">
            Popular Courses
          </h2>
          <p className="text-slate-600 text-lg">
            Invest in your future with our highly demanded, industry-ready training programs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-2xl flex flex-col ${
                plan.popular 
                  ? "bg-white border-2 border-blue-500 shadow-xl shadow-blue-500/10" 
                  : "bg-white border border-slate-200 shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm h-10">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">/ {plan.duration}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                Enroll Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
