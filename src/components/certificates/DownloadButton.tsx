"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface DownloadButtonProps {
  certificateNumber: string;
  studentName: string;
  className?: string;
  disabled?: boolean;
}

export default function DownloadButton({
  certificateNumber,
  studentName,
  className = "",
  disabled = false,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      // Find the certificate template print area in parent document
      const originalElement = document.getElementById("rci-certificate-print-area");
      if (!originalElement) {
        throw new Error("Certificate print area element not found.");
      }

      // Create a hidden iframe to isolate html2canvas from Tailwind v4's global oklch/lab colors
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      iframe.style.top = "-9999px";
      iframe.style.width = "1123px";
      iframe.style.height = "794px";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error("Could not access iframe document");
      }

      // Populate template HTML inside the iframe's completely clean document context
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Certificate Capture</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: transparent;
            }
          </style>
        </head>
        <body>
          ${originalElement.outerHTML}
        </body>
        </html>
      `;

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // Wait a short duration for fonts/assets to resolve inside the iframe's window
      await new Promise((resolve) => setTimeout(resolve, 400));

      const targetElement = iframeDoc.getElementById("rci-certificate-print-area");
      if (!targetElement) {
        throw new Error("Target element inside iframe not found");
      }

      // Render canvas at high DPI using isolated target
      const canvas = await html2canvas(targetElement, {
        scale: 3.125,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#fdfdfd",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // Clean up the iframe immediately after capture
      document.body.removeChild(iframe);

      // Create landscape A4 PDF document
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      pdf.addImage(imgData, "PNG", 0, 0, 297, 210, undefined, "FAST");
      pdf.save(`${studentName.replace(/\s+/g, "_")}_${certificateNumber}.pdf`);

      // Write Audit Log
      try {
        await fetch("/api/certificates/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "Downloaded",
            certificate_number: certificateNumber,
            details: `Certificate downloaded for student ${studentName}`,
          }),
        });
      } catch (auditError) {
        console.error("Failed to log download audit event:", auditError);
      }
    } catch (error) {
      console.error("Failed to download certificate PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || isDownloading}
      className={`inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </>
      )}
    </button>
  );
}
