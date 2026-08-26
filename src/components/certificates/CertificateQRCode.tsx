"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { RCIConfig } from "@/lib/config";
import { AlertCircle } from "lucide-react";

interface CertificateQRCodeProps {
  certificateNumber: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
  showBorder?: boolean;
  quietZone?: boolean;
}

export default function CertificateQRCode({
  certificateNumber,
  size = 160,
  fgColor = "#07152F",
  bgColor = "#FFFFFF",
  className = "",
  showBorder = true,
  quietZone = true,
}: CertificateQRCodeProps) {
  try {
    const verifyUrl = RCIConfig.getVerificationUrl(certificateNumber);

    return (
      <div
        className={`inline-flex flex-col items-center justify-center p-3 bg-white ${
          showBorder ? "rounded-2xl border border-slate-200/90 shadow-2xs" : ""
        } ${className}`}
        aria-label={`Scan QR code to verify certificate ${certificateNumber}`}
      >
        <div className="relative flex items-center justify-center bg-white p-1">
          <QRCodeSVG
            value={verifyUrl}
            size={size}
            level="H"
            fgColor={fgColor}
            bgColor={bgColor}
            includeMargin={quietZone}
          />
        </div>
      </div>
    );
  } catch (err) {
    console.error("Failed to render QR Code SVG:", err);
    return (
      <div
        className={`inline-flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs ${className}`}
        aria-label="QR Code unavailable"
      >
        <AlertCircle className="w-8 h-8 text-amber-500 mb-1" />
        <span className="font-bold text-[11px] text-slate-600">QR Code Error</span>
        <span className="text-[10px] text-slate-400">Use Certificate ID</span>
      </div>
    );
  }
}
