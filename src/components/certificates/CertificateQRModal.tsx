"use client";

import React, { useEffect, useState, useRef } from "react";
import { X, QrCode, Download, Copy, Check, ExternalLink, ShieldCheck } from "lucide-react";
import { Certificate } from "@/types/certificate";
import { RCIConfig } from "@/lib/config";
import CertificateQRCode from "./CertificateQRCode";
import { QRCodeCanvas } from "qrcode.react";

interface CertificateQRModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export default function CertificateQRModal({
  certificate,
  onClose,
}: CertificateQRModalProps) {
  const [copied, setCopied] = useState(false);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (certificate) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [certificate, onClose]);

  if (!certificate) return null;

  const studentName =
    certificate.student_name || certificate.students?.full_name || "Student";
  const courseName =
    certificate.course_name || certificate.courses?.course_name || "Course Program";
  const verificationUrl = RCIConfig.getVerificationUrl(
    certificate.certificate_number
  );

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handleDownloadQR = () => {
    try {
      const canvas = hiddenCanvasRef.current;
      if (!canvas) {
        const domCanvas = document.getElementById(
          `rci-qr-canvas-${certificate.certificate_number}`
        ) as HTMLCanvasElement;
        if (domCanvas) {
          triggerDownload(domCanvas.toDataURL("image/png"));
        }
        return;
      }
      triggerDownload(canvas.toDataURL("image/png"));
    } catch (err) {
      console.error("Failed to download QR image:", err);
    }
  };

  const triggerDownload = (dataUrl: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${certificate.certificate_number}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
      aria-label="Certificate QR Modal Overlay"
    >
      {/* Hidden 1000x1000 high-res canvas for crystal-clear PNG export */}
      <div className="fixed -left-[9999px] -top-[9999px] z-[-100] opacity-0 pointer-events-none">
        <QRCodeCanvas
          id={`rci-qr-canvas-${certificate.certificate_number}`}
          ref={hiddenCanvasRef}
          value={verificationUrl}
          size={1000}
          level="H"
          fgColor="#07152F"
          bgColor="#FFFFFF"
          includeMargin={true}
        />
      </div>

      <div
        className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Certificate QR Code Modal"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-200/60 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-950 tracking-tight font-display">
                Certificate Verification
              </h2>
              <p className="text-[11px] font-medium text-slate-500">
                Official Institutional QR Code
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-600 shrink-0"
            aria-label="Close QR Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Centered Large QR Code Box */}
          <div className="flex flex-col items-center justify-center p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 shadow-2xs">
            <CertificateQRCode
              certificateNumber={certificate.certificate_number}
              size={210}
              className="shadow-sm"
            />
            <span className="mt-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              High-Resolution Scannable QR
            </span>
          </div>

          {/* Certificate Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2.5">
              <span className="text-slate-400 font-extrabold uppercase text-[10.5px] tracking-wider shrink-0 mt-0.5">
                Student
              </span>
              <span className="font-extrabold text-slate-950 text-right truncate">
                {studentName}
              </span>
            </div>

            <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2.5">
              <span className="text-slate-400 font-extrabold uppercase text-[10.5px] tracking-wider shrink-0 mt-0.5">
                Course
              </span>
              <span className="font-bold text-slate-800 text-right truncate">
                {courseName}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2 border-b border-slate-100 pb-2.5">
              <span className="text-slate-400 font-extrabold uppercase text-[10.5px] tracking-wider shrink-0">
                Certificate ID
              </span>
              <span className="font-mono font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 text-xs">
                {certificate.certificate_number}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-extrabold uppercase text-[10.5px] tracking-wider block mb-1">
                Verification URL
              </span>
              <p className="font-mono text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2.5 break-all select-all leading-relaxed">
                {verificationUrl}
              </p>
            </div>
          </div>

          {/* Copied Feedback Toast Alert */}
          {copied && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 animate-in fade-in duration-150">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Verification link copied to clipboard</span>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all shadow-md shadow-blue-500/15 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <Download className="w-4 h-4" />
              <span>Download QR</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-500" />
              )}
              <span>{copied ? "Copied Link" : "Copy Link"}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={verificationUrl}
              target="_blank"
              rel="noreferrer"
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-purple-700 font-bold text-xs py-2.5 px-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
              <span>Verify Online</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] inline-flex items-center justify-center bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 font-bold text-xs py-2.5 px-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
