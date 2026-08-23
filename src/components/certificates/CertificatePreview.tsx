"use client";

import React, { useRef, useState, useEffect } from "react";
import CertificateTemplate, { CertificateTemplateProps } from "./CertificateTemplate";

interface CertificatePreviewProps extends CertificateTemplateProps {
  className?: string;
}

export default function CertificatePreview(props: CertificatePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      // Target certificate width is 1123px
      const targetWidth = 1123;
      const newScale = containerWidth / targetWidth;
      setScale(Math.min(newScale, 1)); // Don't upscale past 1
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Set up a resize observer on the parent container to track resize precisely
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex justify-center items-center overflow-hidden bg-slate-800/5 rounded-2xl border border-slate-200/55 p-4 md:p-8"
      style={{ minHeight: `${794 * scale + 64}px` }}
    >
      <div 
        className="origin-center shadow-2xl transition-all duration-300"
        style={{
          transform: `scale(${scale})`,
          width: "1123px",
          height: "794px",
          margin: `-${(794 * (1 - scale)) / 2}px -${(1123 * (1 - scale)) / 2}px`
        }}
      >
        <CertificateTemplate {...props} />
      </div>
    </div>
  );
}
