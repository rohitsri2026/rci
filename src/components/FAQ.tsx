"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What are the eligibility criteria for the courses?",
    answer: "Most of our basic and diploma courses are open to anyone who has completed 10th or 12th grade. For advanced programming courses, a basic understanding of computers is recommended but not mandatory.",
  },
  {
    question: "Do you provide placement assistance?",
    answer: "Yes, we provide 100% placement assistance for our advanced courses. This includes resume building, interview preparation, and direct interviews with our partner tech companies.",
  },
  {
    question: "Are the certificates government recognized?",
    answer: "Yes, our long-term diploma and certification courses are fully recognized and can be used for government job applications and higher education.",
  },
  {
    question: "Can I pay the fee in installments?",
    answer: "Absolutely! We offer flexible payment plans, allowing you to pay your course fee in easy monthly installments without any hidden interest.",
  },
  {
    question: "What is the batch timing?",
    answer: "We have multiple batches running from 8 AM to 8 PM, Monday to Saturday. You can choose a batch timing that fits your schedule.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-slate-50 relative border-t border-slate-200">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-lg">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-slate-900 pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
