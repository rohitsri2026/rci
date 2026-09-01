"use client";

import React, { useState } from "react";
import { Printer } from "lucide-react";

interface PrintButtonProps {
  certificateNumber: string;
  studentName: string;
  className?: string;
  disabled?: boolean;
}

export default function PrintButton({
  certificateNumber,
  studentName,
  className = "",
  disabled = false,
}: PrintButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    
    // Write Audit Log
    try {
      await fetch("/api/certificates/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Printed",
          certificate_number: certificateNumber,
          details: `Certificate print initiated for student ${studentName}`,
        }),
      });
    } catch (auditError) {
      console.error("Failed to log print audit event:", auditError);
    }

    // Trigger browser print
    window.print();
    setIsPrinting(false);
  };

  return (
    <>
      {/* Print Styles Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Hide all UI containers and enforce color printing */
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body * {
            visibility: hidden !important;
          }
          
          /* Only display the certificate container and its children */
          #rci-certificate-print-area,
          #rci-certificate-print-area * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          #rci-certificate-print-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important; /* Perfect A4 Landscape Width */
            height: 198mm !important; /* Perfect A4 Landscape Height */
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            box-sizing: border-box !important;
            transform: none !important;
            background-size: 297mm 198mm !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
          }
          
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}} />

      <button
        onClick={handlePrint}
        disabled={disabled || isPrinting}
        className={`inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-md shadow-slate-950/10 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <Printer className="w-4 h-4" />
        <span>Print Certificate</span>
      </button>
    </>
  );
}
