import React from "react";

export default function CertificateSeal() {
  return (
    <div className="relative w-24 h-24 select-none shrink-0 flex items-center justify-center">
      {/* Outer Ribbon Elements (if needed, but simple clean modern seal is better) */}
      <svg className="w-full h-full text-[#d4af37]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Starburst/Spikes Background */}
        <path
          d="M50 0 L53 10 L63 5 L63 16 L73 14 L70 24 L79 25 L73 34 L81 37 L73 45 L79 50 L70 55 L73 65 L63 64 L63 75 L53 70 L50 80 L47 70 L37 75 L37 64 L27 65 L30 55 L21 50 L27 45 L19 37 L27 34 L21 25 L30 24 L27 14 L37 16 L37 5 L47 10 Z"
          fill="url(#goldGrad)"
          className="drop-shadow-sm"
        />
        {/* Outer Circle Ring */}
        <circle cx="50" cy="40" r="32" fill="url(#goldGradDark)" stroke="#ffffff" strokeWidth="1" />
        {/* Inner Circle Ring */}
        <circle cx="50" cy="40" r="28" fill="url(#goldGradLight)" stroke="#ffffff" strokeWidth="0.5" />
        {/* Center Crest/Symbol (Book & Torch) */}
        <path
          d="M44 34 L50 31 L56 34 L56 46 C56 49, 53 51, 50 51 C47 51, 44 49, 44 46 Z"
          fill="#534220"
        />
        <path
          d="M42 34 L50 31 L58 34 M42 38 L50 35 L58 38 M42 42 L50 39 L58 42"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M50 31 L50 51"
          stroke="#ffffff"
          strokeWidth="1"
        />
        <circle cx="50" cy="27" r="3" fill="#ffffff" />
        <path d="M48 24 L52 24 L50 20 Z" fill="#ffffff" />
        
        {/* Star elements */}
        <polygon points="50,47 51,49 53,49 52,50 52,52 50,51 48,52 48,50 47,49 49,49" fill="#534220" transform="scale(0.8) translate(12, 12)" />

        {/* Circular text path support */}
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f3e7c4" />
            <stop offset="30%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#aa7c11" />
            <stop offset="100%" stopColor="#f3e7c4" />
          </linearGradient>
          <linearGradient id="goldGradLight" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#faecd0" />
            <stop offset="50%" stopColor="#f3e7c4" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>
          <linearGradient id="goldGradDark" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#b8860b" />
            <stop offset="50%" stopColor="#996515" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Overlay label */}
      <span className="absolute top-[52px] text-[7px] font-bold text-[#534220] uppercase tracking-wider font-sans leading-none text-center max-w-[40px]">
        ROHIT RCI
      </span>
    </div>
  );
}
