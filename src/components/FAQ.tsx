"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What computer courses does Rohit Computer Institute (RCI) offer?",
    answer: "RCI offers a wide range of career-focused computer courses including Diploma in Computer Application (DCA), Tally Prime & GST Accounting, Advanced Web Development, Python Programming, English & Hindi Typing, and Graphic Designing & DTP.",
  },
  {
    question: "What is the admission process at RCI?",
    answer: "Admission is simple! You can apply online through our 'Apply Now' form or visit our campus. Select your interested course, provide contact details, and our counselor will confirm your batch timing and fee plan.",
  },
  {
    question: "What are the course durations?",
    answer: "Course durations range from short-term 2-month typing masteries to 3-6 month accounting and web development certifications, up to 1-year comprehensive diploma (DCA) programs.",
  },
  {
    question: "Is an official certificate provided upon course completion?",
    answer: "Yes, every successful student receives an official Rohit Computer Institute completion certificate complete with a unique Certificate Number and verifiable QR code.",
  },
  {
    question: "How can employers or institutions verify an RCI certificate?",
    answer: "Certificates can be authenticated instantly by entering the Certificate ID (e.g. RCI-2026-000001) on our online Verification Portal (/verify) or by scanning the QR code printed on the physical certificate.",
  },
  {
    question: "Are installment payment options available for course fees?",
    answer: "Yes, RCI offers flexible, interest-free monthly installment fee plans to make technical education easy and affordable for all students.",
  },
  {
    question: "What are the daily batch timings?",
    answer: "We run multiple flexible morning, afternoon, and evening lab batches from 8 AM to 8 PM, Monday to Saturday. You can choose a batch timing that fits your schedule.",
  },
  {
    question: "How do enrolled students access the RCI Student Digital Portal?",
    answer: "Enrolled students are provided secure student portal login credentials (/student/login) upon admission to track fee ledgers, lab attendance records, exam results, and study downloads.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-18 bg-white relative border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        <div className="text-center mb-16">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 mt-4 mb-4 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Find answers to common queries regarding courses, admissions, fees, and certificate verification.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200/90 rounded-2xl bg-slate-50/50 overflow-hidden shadow-2xs hover:bg-white hover:border-blue-300 transition-all"
            >
              <button
                type="button"
                aria-expanded={openIndex === index}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-2xl"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-base sm:text-lg font-bold text-slate-900 pr-4 leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                    openIndex === index ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-200/60 pt-4 bg-white">
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
