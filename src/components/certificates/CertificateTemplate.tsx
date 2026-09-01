import React from "react";
import QRCode from "./QRCode";
import { RCIConfig } from "@/lib/config";

export const DEFAULT_NAME_X = 768;
export const DEFAULT_NAME_Y = 564;

export interface CertificateTemplateProps {
  certificateNumber: string;
  studentName: string;
  courseName: string;
  duration: string;
  grade: string;
  completionDate: string;
  issueDate: string;
  fatherName?: string;
  nameX?: number;
  nameY?: number;
  instituteName?: string;
  directorName?: string;
  directorTitle?: string;
  msmeRegNo?: string;
  address?: string;
  website?: string;
  theme?: "gold" | "indigo" | "charcoal";
}

export default function CertificateTemplate({
  certificateNumber,
  studentName,
  courseName,
  duration,
  grade,
  completionDate,
  issueDate,
  fatherName,
  nameX,
  nameY,
}: CertificateTemplateProps) {

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const formatCertNumber = (num: string) => {
    if (!num) return "RCI-2026-1234";
    if (num.includes("DRAFT") || num.includes("PREVIEW")) return "RCI-2026-1234";
    
    // Extract trailing digits and format as RCI-2026-XXXX (4-digit number)
    const match = num.match(/(\d+)$/);
    if (match) {
      const rawDigits = match[1];
      const fourDigits = rawDigits.length > 4 ? rawDigits.slice(-4) : rawDigits.padStart(4, "0");
      return `RCI-2026-${fourDigits}`;
    }
    return num;
  };

  const formattedCertNumber = formatCertNumber(certificateNumber);
  const formattedCompletionDate = formatDate(completionDate);
  const verifyUrl = RCIConfig.getVerificationUrl(formattedCertNumber);

  return (
    <div 
      id="rci-certificate-print-area"
      className="relative w-[1536px] h-[1024px] shadow-2xl select-none overflow-hidden"
      style={{
        boxSizing: "border-box",
        fontFamily: "Montserrat, Arial, sans-serif",
        backgroundColor: "#ffffff",
        backgroundImage: "url('/new.png')",
        backgroundSize: "1536px 1024px",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#172b6b"
      }}
    >
      {/* Dynamic Google Fonts Import for Signature & Typography */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        
        .font-signature {
          font-family: 'Great Vibes', cursive;
        }
        .font-montserrat {
          font-family: 'Montserrat', Arial, sans-serif;
        }
      `}} />

      {/* 1. Certificate Number (Top Right under Certificate No. - ALWAYS 4-digit e.g. RCI-2026-1234) */}
      <div 
        className="absolute text-center flex items-center justify-center font-extrabold font-montserrat"
        style={{
          left: "1377px",
          top: "96px",
          transform: "translate(-50%, -50%)",
          fontSize: "23px",
          color: "#a61919",
          width: "240px",
          letterSpacing: "0.5px"
        }}
      >
        {formattedCertNumber}
      </div>

      {/* 2. QR Code (Top Right Inside QR Box - Mathematically Centered at X: 1377px, Y: 247px with 8px quiet-zone) */}
      <div 
        className="absolute flex items-center justify-center bg-white rounded-md z-10"
        style={{
          left: "1370px",
          top: "247px",
          transform: "translate(-50%, -50%)",
          width: "154px",
          height: "154px",
          backgroundColor: "#ffffff"
        }}
      >
        <QRCode value={verifyUrl} size={138} fgColor="#0b2240" />
      </div>

      {/* 3. Student Name (Great Vibes Signature Calligraphy) */}
      <div 
        className="absolute text-center flex flex-col items-center justify-center"
        style={{
          left: `${nameX ?? DEFAULT_NAME_X}px`,
          top: `${nameY ?? (fatherName ? 552 : DEFAULT_NAME_Y)}px`,
          transform: "translate(-50%, -50%)",
          width: "800px"
        }}
      >
        <span 
          className="font-signature leading-none select-text px-4 py-1"
          style={{
            fontSize: studentName.length > 25 ? "58px" : studentName.length > 20 ? "68px" : "78px",
            color: "#a85b08",
            textShadow: "0.5px 0.5px 1px rgba(168, 91, 8, 0.15)"
          }}
        >
          {studentName}
        </span>
        {fatherName && (
          <span className="text-xs font-semibold text-slate-500 mt-0.5">
            Son/Daughter of <strong className="text-slate-800 font-bold">{fatherName}</strong>
          </span>
        )}
      </div>

      {/* 4. Course Completion Statement */}
      <div 
        className="absolute text-center font-montserrat text-sm font-medium leading-relaxed flex items-center justify-center gap-1.5"
        style={{
          left: "768px",
          top: "665px",
          transform: "translate(-50%, -50%)",
          width: "1050px",
          fontSize: "19px",
          color: "#111111"
        }}
      >
        <span>has successfully completed the</span>
        <strong className="font-extrabold uppercase tracking-wide px-1" style={{ color: "#172b6b", fontSize: "20px" }}>
          {courseName}
        </strong>
        <span>course from</span>
        <strong className="font-extrabold px-1" style={{ color: "#172b6b", fontSize: "19px" }}>
          Rohit Computer Institute (RCI).
        </strong>
      </div>

      {/* 5. Dedication Statement */}
      <div 
        className="absolute text-center font-montserrat font-medium"
        style={{
          left: "768px",
          top: "704px",
          transform: "translate(-50%, -50%)",
          width: "900px",
          fontSize: "18px",
          color: "#111111"
        }}
      >
        We commend his/her dedication, hard work and commitment towards learning.
      </div>

      {/* 6. Course Duration (Column 1) */}
      <div 
        className="absolute text-center font-montserrat font-extrabold"
        style={{
          left: "475px",
          top: "774px",
          transform: "translate(-50%, -50%)",
          width: "200px",
          fontSize: "22px",
          color: "#111111"
        }}
      >
        {duration}
      </div>

      {/* 7. Secured Grade (Column 2) */}
      <div 
        className="absolute text-center font-montserrat font-extrabold uppercase"
        style={{
          left: "780px",
          top: "774px",
          transform: "translate(-50%, -50%)",
          width: "100px",
          fontSize: "24px",
          color: "#111111"
        }}
      >
        {grade}
      </div>

      {/* 8. Completion Date (Column 3) */}
      <div 
        className="absolute text-center font-montserrat font-extrabold"
        style={{
          left: "1095px",
          top: "774px",
          transform: "translate(-50%, -50%)",
          width: "240px",
          fontSize: "21px",
          color: "#111111"
        }}
      >
        {formattedCompletionDate}
      </div>
    </div>
  );
}

