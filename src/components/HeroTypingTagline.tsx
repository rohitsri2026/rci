"use client";

import React, { useState, useEffect } from "react";

interface PhraseConfig {
  fullText: string;
  prefix: string;
  highlight: string;
}

const PHRASES: PhraseConfig[] = [
  { fullText: "Learn Computer Skills", prefix: "Learn ", highlight: "Computer Skills" },
  { fullText: "Build Your Career", prefix: "Build ", highlight: "Your Career" },
  { fullText: "Get Job Ready", prefix: "Get ", highlight: "Job Ready" },
];

export default function HeroTypingTagline() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  useEffect(() => {
    if (!isMounted || prefersReducedMotion) return;

    const currentPhrase = PHRASES[phraseIndex].fullText;

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing phase
      if (displayText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 70); // ~70ms typing speed
      } else {
        // Completed phrase, pause for 1.5 seconds
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, 35); // Fast, snappy backspace
      } else {
        // Completed deleting, pause 300ms before starting next phrase
        timer = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
        }, 300);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex, isMounted, prefersReducedMotion]);

  // Static fallback if reduced motion is requested
  if (prefersReducedMotion) {
    return (
      <div className="min-h-[30px] sm:min-h-[38px] flex items-center">
        <p className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-100">
          <span>Learn </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 font-extrabold">
            Computer Skills
          </span>
        </p>
      </div>
    );
  }

  // Render prefix and gradient highlight dynamically as characters are typed
  const activeConfig = PHRASES[phraseIndex];
  const prefixLength = activeConfig.prefix.length;

  const prefixPart = displayText.slice(0, prefixLength);
  const highlightPart = displayText.length > prefixLength ? displayText.slice(prefixLength) : "";

  return (
    <div
      className="min-h-[30px] sm:min-h-[38px] flex items-center select-none"
      aria-label={`RCI Goal: ${activeConfig.fullText}`}
    >
      <div className="inline-flex items-center text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-100 font-display">
        {/* Sub-label accent icon */}
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-blue-500/20 text-cyan-300 text-xs mr-2 shrink-0 border border-blue-400/30">
          <i className="fa-solid fa-terminal text-[10px]" />
        </span>

        {/* Regular Action Prefix */}
        <span>{prefixPart}</span>

        {/* Blue-Cyan-Gradient Highlighted Words */}
        {highlightPart && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 font-extrabold ml-0.5 drop-shadow-xs">
            {highlightPart}
          </span>
        )}

        {/* Blinking Vertical Cursor */}
        <span
          className="inline-block w-0.5 sm:w-[3px] h-4 sm:h-5 ml-1 bg-cyan-400 align-middle animate-pulse rounded-full shadow-[0_0_8px_rgba(34,211,238,0.7)]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
