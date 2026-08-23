import React from "react";

export default function CertificateBorder() {
  return (
    <div className="absolute inset-0 pointer-events-none p-6 select-none">
      {/* Outer Border (Gold) */}
      <div className="w-full h-full border-[6px] border-[#c5a880] rounded-lg relative p-3">
        {/* Inner Border (Thin Gold) */}
        <div className="w-full h-full border-2 border-[#d9c4a4] rounded">
          {/* Decorative Corner Ornaments */}
          
          {/* Top-Left Corner */}
          <svg className="absolute -top-3.5 -left-3.5 w-10 h-10 text-[#c5a880]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 L40,0 L40,10 L10,10 L10,40 L0,40 Z" />
            <circle cx="20" cy="20" r="6" />
            <circle cx="35" cy="12" r="3" />
            <circle cx="12" cy="35" r="3" />
          </svg>
          
          {/* Top-Right Corner */}
          <svg className="absolute -top-3.5 -right-3.5 w-10 h-10 text-[#c5a880]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M100,0 L60,0 L60,10 L90,10 L90,40 L100,40 Z" />
            <circle cx="80" cy="20" r="6" />
            <circle cx="65" cy="12" r="3" />
            <circle cx="88" cy="35" r="3" />
          </svg>

          {/* Bottom-Left Corner */}
          <svg className="absolute -bottom-3.5 -left-3.5 w-10 h-10 text-[#c5a880]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,100 L40,100 L40,90 L10,90 L10,60 L0,60 Z" />
            <circle cx="20" cy="80" r="6" />
            <circle cx="35" cy="88" r="3" />
            <circle cx="12" cy="65" r="3" />
          </svg>

          {/* Bottom-Right Corner */}
          <svg className="absolute -bottom-3.5 -right-3.5 w-10 h-10 text-[#c5a880]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M100,100 L60,100 L60,90 L90,90 L90,60 L100,60 Z" />
            <circle cx="80" cy="80" r="6" />
            <circle cx="65" cy="88" r="3" />
            <circle cx="88" cy="65" r="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
