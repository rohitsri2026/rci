import React from "react";
import CertificateBorder from "./CertificateBorder";
import CertificateSeal from "./CertificateSeal";
import QRCode from "./QRCode";
import { Calendar, Award, CalendarCheck, MapPin, Globe, Phone } from "lucide-react";

// Reusable SVG for Ashoka emblem & MSME logo combination with explicit hex colors to bypass Tailwind v4 oklch/lab variables
const MSMELogoGroup = () => (
  <div className="flex items-center gap-3 select-none">
    {/* Ashoka Pillar Lion Crest */}
    <svg width="34" height="34" viewBox="0 0 100 100" fill="none" className="shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 C47 5 45 7 45 10 C45 12 46 14 48 15 C40 18 35 25 35 32 C35 34 37 36 39 36 C41 36 43 34 43 32 C43 28 46 25 50 25 C54 25 57 28 57 32 C57 34 59 36 61 36 C63 36 65 34 65 32 C65 25 60 18 52 15 C54 14 55 12 55 10 C55 7 53 5 50 5 Z" fill="#1e293b"/>
      <rect x="42" y="38" width="16" height="35" rx="1" fill="#1e293b"/>
      <line x1="38" y1="45" x2="62" y2="45" stroke="#ffffff" strokeWidth="2.5"/>
      <line x1="40" y1="58" x2="60" y2="58" stroke="#ffffff" strokeWidth="2.5"/>
      <circle cx="50" cy="51" r="4" fill="#ffffff"/>
      <path d="M30 75 L70 75 L65 83 L35 83 Z" fill="#1e293b"/>
      <text x="50" y="93" textAnchor="middle" fill="#1e293b" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">सत्यमेव जयते</text>
    </svg>
    
    {/* MSME Official Emblem Text */}
    <div className="flex flex-col" style={{ color: "#1e293b" }}>
      <svg width="65" height="18" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="20" fill="#1e293b" fontSize="19" fontWeight="900" fontFamily="'Arial Black', sans-serif" letterSpacing="-1">MSME</text>
      </svg>
      <span style={{ color: "#64748b" }} className="text-[6.5px] font-bold uppercase tracking-wider leading-none mt-0.5">
        Micro, Small & Medium Enterprises
      </span>
      <span style={{ color: "#1e293b" }} className="text-[6px] font-bold uppercase tracking-widest leading-none mt-0.5">
        Ministry of MSME, Govt. of India
      </span>
    </div>
  </div>
);

// Gold foil starburst seal tailored specifically for RCI with pure linear gradients
const RCIGoldSeal = () => (
  <div className="relative w-22 h-22 select-none shrink-0 flex items-center justify-center">
    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 0 L53 10 L63 5 L63 16 L73 14 L70 24 L79 25 L73 34 L81 37 L73 45 L79 50 L70 55 L73 65 L63 64 L63 75 L53 70 L50 80 L47 70 L37 75 L37 64 L27 65 L30 55 L21 50 L27 45 L19 37 L27 34 L21 25 L30 24 L27 14 L37 16 L37 5 L47 10 Z"
        fill="url(#sealGoldGrad)"
      />
      <circle cx="50" cy="40" r="31" fill="url(#sealGoldGradDark)" stroke="#ffffff" strokeWidth="0.8" />
      <circle cx="50" cy="40" r="27" fill="url(#sealGoldGradLight)" stroke="#ffffff" strokeWidth="0.4" />
      <path d="M50 21 L51.5 24.5 L55 24.5 L52 26.5 L53.5 30 L50 28 L46.5 30 L48 26.5 L45 24.5 L48.5 24.5 Z" fill="#534220"/>
      <defs>
        <linearGradient id="sealGoldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f8eec9" />
          <stop offset="35%" stopColor="#d4af37" />
          <stop offset="65%" stopColor="#b48b1b" />
          <stop offset="100%" stopColor="#f8eec9" />
        </linearGradient>
        <linearGradient id="sealGoldGradLight" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fdf5da" />
          <stop offset="50%" stopColor="#f8eec9" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
        <linearGradient id="sealGoldGradDark" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b48b1b" />
          <stop offset="50%" stopColor="#8d6c12" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>
    </svg>
    <div className="absolute top-[36px] flex flex-col items-center justify-center leading-none text-center">
      <span className="text-[8px] font-black tracking-wider font-sans uppercase" style={{ color: "#534220" }}>RCI</span>
      <span className="text-[4.5px] font-bold tracking-wide font-sans mt-0.5" style={{ color: "#534220" }}>Excellence in</span>
      <span className="text-[4.5px] font-bold tracking-wide font-sans mt-0.5" style={{ color: "#534220" }}>Education</span>
    </div>
  </div>
);

export interface CertificateTemplateProps {
  certificateNumber: string;
  studentName: string;
  courseName: string;
  duration: string;
  grade: string;
  completionDate: string;
  issueDate: string;
  fatherName?: string;
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
  instituteName = "ROHIT COMPUTER INSTITUTE",
  directorName = "Managing Director",
  directorTitle = "Rohit Computer Institute (RCI)",
  msmeRegNo = "UDYAM-UP-54-0023456",
  address = "Sanjay Nagar, Cantt, Kanpur, Uttar Pradesh",
  website = "rciknp.vercel.app",
  theme = "gold",
}: CertificateTemplateProps) {

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const day = date.getDate();
      const year = date.getFullYear();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const formattedCompletionDate = formatDate(completionDate);
  const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : "https://rciknp.vercel.app"}/verify/${certificateNumber}`;

  return (
    <div 
      id="rci-certificate-print-area"
      className="relative w-[1123px] h-[794px] shadow-2xl flex flex-col justify-between p-12 select-none overflow-hidden"
      style={{
        boxSizing: "border-box",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#fdfdfd",
        color: "#0f2547"
      }}
    >
      {/* Dynamic Fonts Import for Calligraphy & Branding */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Great+Vibes&family=Playfair+Display:ital,wght@0,600;0,700;1,500;1,600&display=swap');
        
        .font-cinzel {
          font-family: 'Cinzel', serif;
        }
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        .font-signature {
          font-family: 'Great Vibes', cursive;
        }
        .text-shadow-sm {
          text-shadow: 0.5px 0.5px 1px rgba(15, 37, 71, 0.1);
        }
      `}} />

      {/* Faint watermark crest on the right side - using static hex colors to prevent oklch rendering crashes */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
        <svg width="340" height="340" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#0f2547" strokeWidth="1" strokeDasharray="3 3"/>
          <circle cx="50" cy="50" r="40" stroke="#0f2547" strokeWidth="2"/>
          <path d="M50 15 L55 35 L75 35 L60 45 L65 65 L50 55 L35 65 L40 45 L25 35 L45 35 Z" fill="#0f2547"/>
          <text x="50" y="80" textAnchor="middle" fill="#0f2547" fontSize="6.5" fontWeight="bold">ROHIT RCI</text>
        </svg>
      </div>

      {/* Decorative Top-Left Corner Curves */}
      <div className="absolute top-0 left-0 w-60 h-60 pointer-events-none select-none">
        <svg className="w-full h-full" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
          {/* Main blue curve */}
          <path d="M0 0 L 85 0 C 70 65, 65 70, 0 85 Z" fill="#0b2240" />
          {/* Gold highlight border */}
          <path d="M0 0 L 85 0 C 70 65, 65 70, 0 85 Z" fill="none" stroke="#c5a880" strokeWidth="2.5" />
          {/* Inner blue line */}
          <path d="M0 0 L 72 0 C 60 55, 55 60, 0 72 Z" fill="#122a4a" />
          {/* Thin gold inner border */}
          <path d="M0 0 L 72 0 C 60 55, 55 60, 0 72 Z" fill="none" stroke="#c5a880" strokeWidth="0.8" />
          {/* Faint blue overlay shadow */}
          <path d="M0 0 L 52 0 C 42 42, 42 42, 0 52 Z" fill="#1e3a8a" opacity="0.15" />
          <path d="M0 0 L 30 0 C 20 20, 20 20, 0 30 Z" fill="#0b2240" />
        </svg>
      </div>

      {/* Decorative Bottom-Right Corner Curves */}
      <div className="absolute bottom-0 right-0 w-60 h-60 pointer-events-none select-none">
        <svg className="w-full h-full" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
          {/* Main blue curve */}
          <path d="M150 150 L 65 150 C 80 85, 85 80, 150 65 Z" fill="#0b2240" />
          {/* Gold highlight border */}
          <path d="M150 150 L 65 150 C 80 85, 85 80, 150 65 Z" fill="none" stroke="#c5a880" strokeWidth="2.5" />
          {/* Inner blue line */}
          <path d="M150 150 L 78 150 C 90 95, 95 90, 150 78 Z" fill="#122a4a" />
          {/* Thin gold inner border */}
          <path d="M150 150 L 78 150 C 90 95, 95 90, 150 78 Z" fill="none" stroke="#c5a880" strokeWidth="0.8" />
          {/* Faint blue overlay shadow */}
          <path d="M150 150 L 98 150 C 108 108, 108 108, 150 98 Z" fill="#1e3a8a" opacity="0.15" />
          <path d="M150 150 L 120 150 C 130 130, 130 130, 150 120 Z" fill="#0b2240" />
        </svg>
      </div>

      {/* Double Gold Line Border around content */}
      <div className="absolute inset-0 pointer-events-none p-5 select-none">
        <div className="w-full h-full rounded p-1" style={{ borderColor: "#c5a880", borderWidth: "1px", borderStyle: "solid" }}>
          <div className="w-full h-full rounded" style={{ borderColor: "#c5a880", borderWidth: "1.5px", borderStyle: "solid" }}></div>
        </div>
      </div>

      {/* 1. Header Section */}
      <div className="z-10 flex items-center justify-between mt-3 px-6">
        {/* Left Circular Crest Container */}
        <div 
          className="flex items-center justify-center rounded-full p-1 shadow-md w-26 h-26 shrink-0 overflow-hidden"
          style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9", borderWidth: "2px", borderStyle: "solid" }}
        >
          <img 
            src="/logo.png" 
            alt="RCI Crest Logo" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Central Brand Titles */}
        <div className="text-center flex-1 px-4 flex flex-col items-center">
          {/* Huge gold-trimmed RCI */}
          <div className="flex items-center justify-center gap-4 mb-0.5">
            <span className="w-8 h-[1px] opacity-70" style={{ backgroundColor: "#c5a880" }}></span>
            <span className="w-2 h-2 rotate-45" style={{ backgroundColor: "#c5a880" }}></span>
            <h1 
              className="font-cinzel font-extrabold text-5xl tracking-widest text-shadow-sm leading-none"
              style={{ color: "#0f2547" }}
            >
              RCI
            </h1>
            <span className="w-2 h-2 rotate-45" style={{ backgroundColor: "#c5a880" }}></span>
            <span className="w-8 h-[1px] opacity-70" style={{ backgroundColor: "#c5a880" }}></span>
          </div>

          <h2 className="font-sans font-black text-xl tracking-wider leading-tight" style={{ color: "#0f2547" }}>
            {instituteName}
          </h2>
          
          <p className="text-[8.5px] tracking-[0.25em] font-black uppercase mt-1 leading-none" style={{ color: "#c5a880" }}>
            EMPOWERING SKILLS, CREATING FUTURES
          </p>
          
          {/* Ministry/MSME pill banner */}
          <div 
            className="text-white text-[8px] font-bold px-6 py-1 rounded-full uppercase tracking-wider mt-2.5 shadow-sm"
            style={{ backgroundColor: "#0b2240" }}
          >
            Regd. under Ministry of MSME, Government of India
          </div>
        </div>

        {/* Right Verification & Number Section */}
        <div className="flex flex-col items-end shrink-0 gap-1.5 min-w-[130px]">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>Certificate No.</span>
            <p className="text-sm font-extrabold font-mono tracking-wide leading-none mt-1" style={{ color: "#b91c1c" }}>
              {certificateNumber}
            </p>
          </div>
          
          {/* Small decorative ornament */}
          <div className="flex items-center gap-1 opacity-70">
            <span className="w-4 h-[1px]" style={{ backgroundColor: "#c5a880" }}></span>
            <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: "#c5a880" }}></span>
            <span className="w-4 h-[1px]" style={{ backgroundColor: "#c5a880" }}></span>
          </div>

          {/* QR code box matching RCI layout */}
          <div className="flex flex-col items-center bg-white p-1 rounded shadow-sm" style={{ borderColor: "#e2e8f0", borderWidth: "1px", borderStyle: "solid" }}>
            <QRCode value={verifyUrl} size={56} fgColor="#0b2240" />
            <span 
              className="text-white text-[5px] font-bold px-1 py-0.5 rounded-sm uppercase tracking-wide mt-1 leading-none select-none"
              style={{ backgroundColor: "#0b2240" }}
            >
              SCAN TO VERIFY
            </span>
          </div>
        </div>
      </div>

      {/* 2. Certificate Body Section */}
      <div className="z-10 text-center flex-1 flex flex-col justify-center my-2 space-y-4">
        {/* Certificate Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-[0.18em] font-cinzel leading-none" style={{ color: "#0f2547" }}>
            Certificate
          </h2>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: "#0f2547" }}>
            of Completion
          </p>
          
          {/* Styled Ribbon Banner for "This is to certify that" */}
          <div className="relative mt-2">
            <div 
              className="text-white px-10 py-1 uppercase font-bold text-[9px] tracking-[0.25em] inline-block mx-auto min-w-[240px] shadow-sm leading-normal"
              style={{ backgroundColor: "#0b2240", borderTop: "1.5px solid #c5a880", borderBottom: "1.5px solid #c5a880" }}
            >
              THIS IS TO CERTIFY THAT
              {/* Chevron shadow-folds (left/right) */}
              <div className="absolute -left-1.5 top-0.5 w-1.5 h-full -skew-y-12" style={{ backgroundColor: "#071830" }}></div>
              <div className="absolute -right-1.5 top-0.5 w-1.5 h-full skew-y-12" style={{ backgroundColor: "#071830" }}></div>
            </div>
          </div>
        </div>

        {/* Student Name */}
        <div className="pt-1">
          <h3 
            className="font-playfair italic font-medium text-4xl tracking-wide leading-none drop-shadow-sm select-text"
            style={{ color: "#c5a880" }}
          >
            {studentName}
          </h3>
          {fatherName && (
            <p className="text-[10px] mt-1 font-semibold" style={{ color: "#64748b" }}>
              Son/Daughter of <span style={{ color: "#1e293b" }} className="font-bold">{fatherName}</span>
            </p>
          )}
        </div>

        {/* Completion Statement */}
        <div className="space-y-1 max-w-2xl mx-auto leading-relaxed">
          <p className="text-[11px] font-medium" style={{ color: "#64748b" }}>
            has successfully completed the <span className="font-black uppercase tracking-wide" style={{ color: "#0f2547" }}>{courseName}</span> course from <span className="font-bold" style={{ color: "#1e293b" }}>Rohit Computer Institute (RCI)</span>.
          </p>
          <p className="text-[10px] font-medium italic" style={{ color: "#78889b" }}>
            We commend his/her dedication, hard work and commitment towards learning.
          </p>
        </div>

        {/* Metrics Rows (Duration, Grade, Completion Date) */}
        <div className="flex justify-center items-center gap-12 pt-1 max-w-xl mx-auto">
          {/* Column 1: Duration */}
          <div className="flex items-center gap-2.5 text-left">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(219, 234, 254, 0.3)", borderColor: "#f1f5f9", borderWidth: "1px", borderStyle: "solid" }}
            >
              <Calendar className="w-4.5 h-4.5" style={{ color: "#0b2240" }} />
            </div>
            <div>
              <p className="text-[7.5px] font-black uppercase tracking-wider leading-none" style={{ color: "#94a3b8" }}>COURSE DURATION</p>
              <p className="text-[11px] font-black mt-0.5 leading-none" style={{ color: "#0f2547" }}>{duration}</p>
            </div>
          </div>

          <span className="h-6 w-[1px] opacity-40" style={{ backgroundColor: "#c5a880" }}></span>

          {/* Column 2: Grade */}
          <div className="flex items-center gap-2.5 text-left">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(219, 234, 254, 0.3)", borderColor: "#f1f5f9", borderWidth: "1px", borderStyle: "solid" }}
            >
              <Award className="w-4.5 h-4.5" style={{ color: "#0b2240" }} />
            </div>
            <div>
              <p className="text-[7.5px] font-black uppercase tracking-wider leading-none" style={{ color: "#94a3b8" }}>GRADE</p>
              <p className="text-[11px] font-black mt-0.5 leading-none" style={{ color: "#0f2547" }}>{grade}</p>
            </div>
          </div>

          <span className="h-6 w-[1px] opacity-40" style={{ backgroundColor: "#c5a880" }}></span>

          {/* Column 3: Completion Date */}
          <div className="flex items-center gap-2.5 text-left">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(219, 234, 254, 0.3)", borderColor: "#f1f5f9", borderWidth: "1px", borderStyle: "solid" }}
            >
              <CalendarCheck className="w-4.5 h-4.5" style={{ color: "#0b2240" }} />
            </div>
            <div>
              <p className="text-[7.5px] font-black uppercase tracking-wider leading-none" style={{ color: "#94a3b8" }}>COMPLETION DATE</p>
              <p className="text-[11px] font-black mt-0.5 leading-none" style={{ color: "#0f2547" }}>{formattedCompletionDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer Section */}
      <div className="z-10 flex items-end justify-between px-6 mb-3">
        {/* Left Side: MSME Registrations Group */}
        <div className="w-60 pb-1">
          <MSMELogoGroup />
        </div>

        {/* Center Side: Premium RCI Gold foil seal */}
        <div className="pb-1">
          <RCIGoldSeal />
        </div>

        {/* Right Side: Signatures & Title */}
        <div className="text-center w-52 relative pb-1">
          {/* Handwriting Signature */}
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none select-none">
            <span className="font-signature text-3xl font-medium leading-none" style={{ color: "rgba(30, 58, 138, 0.95)" }}>
              Sandeep
            </span>
          </div>
          <div className="w-full pt-1" style={{ borderTop: "1px solid #cbd5e1" }}>
            <p className="text-[9.5px] font-black tracking-wide uppercase leading-none font-sans" style={{ color: "#1e293b" }}>
              {directorName}
            </p>
            <p className="text-[7.5px] font-black uppercase tracking-wider mt-0.5 leading-none" style={{ color: "#c5a880" }}>
              {directorTitle}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Location / Website details bar */}
      <div 
        className="absolute bottom-0 inset-x-0 py-2 text-white flex items-center justify-center gap-6 text-[8px] font-bold select-none z-10"
        style={{ backgroundColor: "#0b2240", borderTop: "2px solid #c5a880" }}
      >
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" style={{ color: "#c5a880" }} />
          <span>{address}</span>
        </span>
        <span className="h-3 w-[1.5px] opacity-40" style={{ backgroundColor: "#c5a880" }}></span>
        <span className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" style={{ color: "#c5a880" }} />
          <span>www.rciknp.vercel.app</span>
        </span>
        <span className="h-3 w-[1.5px] opacity-40" style={{ backgroundColor: "#c5a880" }}></span>
        <span className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" style={{ color: "#c5a880" }} />
          <span>+91 98765 43210</span>
        </span>
      </div>
    </div>
  );
}
