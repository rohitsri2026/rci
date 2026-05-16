"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, XCircle, AlertCircle, Download, Award, User, BookOpen, Calendar, Building2 } from "lucide-react";
import Image from "next/image";

const statusConfig = {
  Valid: { color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2, badge: "bg-green-500", label: "Certificate Verified" },
  Revoked: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: XCircle, badge: "bg-red-500", label: "Certificate Revoked" },
  Expired: { color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200", icon: AlertCircle, badge: "bg-slate-400", label: "Certificate Expired" },
};

export default function CertificateCard({ cert }: { cert: any }) {
  const printRef = useRef<HTMLDivElement>(null);
  const cfg = statusConfig[cert.status as keyof typeof statusConfig] ?? statusConfig.Valid;
  const Icon = cfg.icon;
  const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : "https://rciknp.vercel.app"}/verify/${cert.certificate_id}`;

  const handleDownloadPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`${cert.certificate_id}.pdf`);
  };

  return (
    <div>
      {/* Status Banner */}
      <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl mb-6 border ${cfg.bg} ${cfg.border}`}>
        <Icon className={`w-7 h-7 ${cfg.color}`} />
        <div>
          <p className={`font-bold text-lg ${cfg.color}`}>{cfg.label}</p>
          <p className="text-slate-500 text-sm">Certificate ID: <span className="font-mono font-semibold">{cert.certificate_id}</span></p>
        </div>
        <span className={`ml-auto px-4 py-1 rounded-full text-white text-sm font-bold ${cfg.badge}`}>{cert.status}</span>
      </div>

      {/* Certificate Card — printable */}
      <div ref={printRef} className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden mb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-white flex items-center gap-6">
          <div className="bg-white rounded-full p-2 shrink-0">
            <Image src="/logo.png" alt="RCI" width={60} height={60} className="w-14 h-14 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display">Rohit Computer Institute</h1>
            <p className="text-blue-200 text-sm">Sanjay Nagar Cantt, Kanpur, UP — 208004</p>
            <p className="text-blue-200 text-sm mt-1">rciknp.vercel.app</p>
          </div>
        </div>

        {/* Certificate body */}
        <div className="p-8">
          <p className="text-center text-slate-500 text-sm uppercase tracking-widest mb-2">Certificate of Completion</p>
          <p className="text-center text-slate-400 text-sm mb-8">This is to certify that</p>

          <div className="space-y-5 mb-8">
            {[
              { icon: User, label: "Student Name", value: cert.student_name },
              { icon: BookOpen, label: "Course Completed", value: cert.course_name },
              { icon: Calendar, label: "Issue Date", value: cert.issue_date },
              { icon: Building2, label: "Issued By", value: cert.issued_by },
              { icon: Award, label: "Certificate ID", value: cert.certificate_id, mono: true },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <row.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">{row.label}</p>
                  <p className={`font-semibold text-slate-900 ${row.mono ? "font-mono text-blue-700" : ""}`}>{row.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-3">Scan to verify authenticity</p>
            <QRCodeSVG value={verifyUrl} size={120} includeMargin bgColor="#ffffff" fgColor="#1e3a5f" />
            <p className="text-xs text-slate-400 mt-2 break-all text-center">{verifyUrl}</p>
          </div>
        </div>

        {/* Footer bar */}
        <div className="bg-blue-900 text-center py-3 text-blue-200 text-xs font-medium">
          This certificate is digitally verifiable • Rohit Computer Institute © {new Date().getFullYear()}
        </div>
      </div>

      {/* Download button */}
      {cert.status === "Valid" && (
        <button
          onClick={handleDownloadPDF}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
        >
          <Download className="w-5 h-5" />
          Download Certificate PDF
        </button>
      )}
    </div>
  );
}
