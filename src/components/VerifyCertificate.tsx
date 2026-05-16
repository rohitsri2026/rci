"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, XCircle, Award, Calendar, User, BookOpen } from "lucide-react";

// Mock Database
const MOCK_CERTIFICATES: Record<string, { studentName: string, course: string, grade: string, issueDate: string }> = {
  "RCI-12345": {
    studentName: "Aman Gupta",
    course: "Advanced Web Development",
    grade: "A+",
    issueDate: "May 15, 2026"
  },
  "RCI-67890": {
    studentName: "Priya Sharma",
    course: "Master Diploma (DCA)",
    grade: "A",
    issueDate: "January 10, 2026"
  }
};

export default function VerifyCertificate() {
  const [certId, setCertId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<any>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setStatus("loading");
    
    // Simulate network request
    setTimeout(() => {
      const normalizedId = certId.trim().toUpperCase();
      const certData = MOCK_CERTIFICATES[normalizedId];
      
      if (certData) {
        setResult({ id: normalizedId, ...certData });
        setStatus("success");
      } else {
        setResult(null);
        setStatus("error");
      }
    }, 1500);
  };

  return (
    <section id="verify" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-6">
              Verify Certificate
            </h2>
            <p className="text-slate-600 text-lg">
              Employers and institutions can instantly verify the authenticity of an RCI certificate by entering the unique Certificate ID below.
            </p>
          </div>

          <div className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <form onSubmit={handleVerify} className="relative z-10 max-w-xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Award className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    placeholder="Enter Certificate ID (e.g. RCI-12345)"
                    className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading" || !certId.trim()}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                >
                  {status === "loading" ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Verify
                    </>
                  )}
                </button>
              </div>
            </form>

            <AnimatePresence mode="wait">
              {status === "success" && result && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-6 md:p-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">Authentic Certificate Verified</h3>
                      <p className="text-green-700 font-medium mb-6">Certificate ID: {result.id}</p>
                      
                      <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                          <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-1"><User className="w-4 h-4"/> Student Name</p>
                          <p className="font-semibold text-slate-900">{result.studentName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-1"><BookOpen className="w-4 h-4"/> Course Enrolled</p>
                          <p className="font-semibold text-slate-900">{result.course}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-1"><Award className="w-4 h-4"/> Grade / Score</p>
                          <p className="font-semibold text-slate-900">{result.grade}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-1"><Calendar className="w-4 h-4"/> Issue Date</p>
                          <p className="font-semibold text-slate-900">{result.issueDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8 flex items-start gap-4"
                >
                  <XCircle className="w-8 h-8 text-red-500 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Verification Failed</h3>
                    <p className="text-slate-700">
                      We could not find a certificate with the ID <span className="font-semibold text-red-600">"{certId}"</span>. 
                      Please check the ID and try again, or contact the institute administration for assistance.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
