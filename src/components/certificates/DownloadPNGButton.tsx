"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";

interface DownloadPNGButtonProps {
  certificateNumber: string;
  studentName: string;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export default function DownloadPNGButton({
  certificateNumber,
  studentName,
  className = "",
  disabled = false,
  variant = "secondary",
}: DownloadPNGButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPNG = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const { default: html2canvas } = await import("html2canvas");

      // Locate the certificate template element
      const originalElement = document.getElementById("rci-certificate-print-area");
      if (!originalElement) {
        throw new Error("Certificate print area element not found.");
      }

      // Create a hidden isolated iframe to render HTML without Tailwind v4 OKLCH variable issues
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      iframe.style.top = "-9999px";
      iframe.style.width = "1123px";
      iframe.style.height = "794px";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error("Could not access iframe document context");
      }

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

      // Wait 450ms for web fonts (Great Vibes, Cinzel) and images to resolve inside the iframe
      await new Promise((resolve) => setTimeout(resolve, 450));

      const targetElement = iframeDoc.getElementById("rci-certificate-print-area");
      if (!targetElement) {
        throw new Error("Target element inside iframe not found");
      }

      // Render high-DPI canvas (3.125 scale for 300 DPI 3508x2480px PNG output)
      const canvas = await html2canvas(targetElement, {
        scale: 3.125,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#fdfdfd",
        logging: false,
      });

      // Clean up the temporary iframe
      document.body.removeChild(iframe);

      // Convert to blob and download PNG file
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Failed to generate image blob");
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const safeName = studentName ? studentName.trim().replace(/\s+/g, "-") : "Student";
        link.download = `RCI-Certificate-${safeName}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png", 1.0);

      // Log download audit event
      try {
        await fetch("/api/certificates/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "Downloaded",
            certificate_number: certificateNumber,
            details: `Certificate PNG downloaded for student ${studentName}`,
          }),
        });
      } catch (auditError) {
        console.error("Failed to log download audit event:", auditError);
      }
    } catch (error: any) {
      console.error("Failed to download certificate PNG:", error);
      alert(error.message || "Failed to generate certificate PNG image.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/10";
      case "outline":
        return "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs";
      case "secondary":
      default:
        return "bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold";
    }
  };

  return (
    <button
      onClick={handleDownloadPNG}
      disabled={disabled || isDownloading}
      className={`inline-flex items-center justify-center gap-2 font-bold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm ${getVariantStyles()} ${className}`}
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
          <span>Generating PNG...</span>
        </>
      ) : (
        <>
          <ImageIcon className="w-4 h-4 text-emerald-600" />
          <span>Download PNG</span>
        </>
      )}
    </button>
  );
}
