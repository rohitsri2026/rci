"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
}

export default function QRCode({
  value,
  size = 90,
  fgColor = "#0f172a",
  bgColor = "#ffffff",
}: QRCodeProps) {
  return (
    <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm inline-block shrink-0">
      <QRCodeSVG
        value={value}
        size={size}
        level="H"
        includeMargin={false}
        fgColor={fgColor}
        bgColor={bgColor}
      />
    </div>
  );
}
