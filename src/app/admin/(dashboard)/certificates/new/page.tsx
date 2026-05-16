"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Award } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

function generateCertId() {
  const year = new Date().getFullYear();
  const num = String(Math.floor(100 + Math.random() * 900)).padStart(3, "0");
  return `RCI-${year}-${num}`;
}

export default function NewCertificatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    certificate_id: generateCertId(),
    student_name: "",
    course_name: "",
    issue_date: new Date().toISOString().split("T")[0],
    issued_by: "Rohit Computer Institute",
    status: "Valid",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [issued, setIssued] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      setLoading(false);
    } else {
      setIssued(json);
      setLoading(false);
    }
  };

  const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : "https://rciknp.vercel.app"}/verify/${form.certificate_id}`;

  if (issued) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 font-display mb-8">Certificate Issued! 🎉</h1>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Award className="w-10 h-10 text-green-600" />
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Certificate ID</p>
              <p className="text-2xl font-bold font-mono text-green-700">{issued.certificate_id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div><p className="text-slate-500 mb-1">Student</p><p className="font-semibold text-slate-900">{issued.student_name}</p></div>
            <div><p className="text-slate-500 mb-1">Course</p><p className="font-semibold text-slate-900">{issued.course_name}</p></div>
            <div><p className="text-slate-500 mb-1">Issue Date</p><p className="font-semibold text-slate-900">{issued.issue_date}</p></div>
            <div><p className="text-slate-500 mb-1">Status</p><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">{issued.status}</span></div>
          </div>
          {/* QR Code */}
          <div className="flex flex-col items-center bg-white rounded-xl p-6 border border-green-100">
            <p className="text-sm text-slate-500 mb-4">QR Code — Scan to verify</p>
            <QRCodeSVG value={verifyUrl} size={160} includeMargin />
            <p className="text-xs text-slate-400 mt-3 text-center break-all">{verifyUrl}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => { setIssued(null); setForm({ ...form, certificate_id: generateCertId() }); }}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Issue Another
          </button>
          <Link href="/admin/certificates" className="flex-1 text-center bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
            View All Certificates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/certificates" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Certificates
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 font-display mb-8">Issue New Certificate</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Certificate ID (Auto-generated)</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={form.certificate_id}
                onChange={(e) => setForm({ ...form, certificate_id: e.target.value })}
                className="flex-1 border border-slate-300 rounded-xl px-4 py-3 font-mono font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button type="button" onClick={() => setForm({ ...form, certificate_id: generateCertId() })} className="px-4 py-3 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 text-sm font-medium transition-colors">
                Regenerate
              </button>
            </div>
          </div>

          {[
            { label: "Student Full Name", key: "student_name", placeholder: "e.g. Aman Gupta", required: true },
            { label: "Course Name", key: "course_name", placeholder: "e.g. Advanced Web Development", required: true },
            { label: "Issued By", key: "issued_by", placeholder: "e.g. Rohit Computer Institute", required: false },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-700 mb-2">{f.label}</label>
              <input
                type="text"
                value={(form as any)[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                required={f.required}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Issue Date</label>
              <input type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} required className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Valid">Valid</option>
                <option value="Revoked">Revoked</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors mt-2">
            <Award className="w-5 h-5" />
            {loading ? "Issuing..." : "Issue Certificate"}
          </button>
        </form>
      </div>
    </div>
  );
}
