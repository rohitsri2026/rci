"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Particle {
  id: number;
  top: string;
  left: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
  baseOpacity: number;
}

// 20 predefined particles with deterministic coordinates to avoid SSR hydration mismatch
const PARTICLES: Particle[] = [
  { id: 1, top: "12%", left: "8%", size: 4, color: "rgba(34, 211, 238, 0.7)", duration: 13, delay: -2, baseOpacity: 0.4 },
  { id: 2, top: "25%", left: "22%", size: 3, color: "rgba(56, 189, 248, 0.6)", duration: 16, delay: -6, baseOpacity: 0.3 },
  { id: 3, top: "18%", left: "42%", size: 5, color: "rgba(167, 139, 250, 0.5)", duration: 14, delay: -4, baseOpacity: 0.35 },
  { id: 4, top: "35%", left: "15%", size: 3.5, color: "rgba(34, 211, 238, 0.65)", duration: 18, delay: -9, baseOpacity: 0.4 },
  { id: 5, top: "48%", left: "32%", size: 4, color: "rgba(56, 189, 248, 0.55)", duration: 12, delay: -3, baseOpacity: 0.3 },
  { id: 6, top: "62%", left: "10%", size: 4.5, color: "rgba(167, 139, 250, 0.6)", duration: 15, delay: -7, baseOpacity: 0.35 },
  { id: 7, top: "78%", left: "25%", size: 3, color: "rgba(34, 211, 238, 0.5)", duration: 17, delay: -11, baseOpacity: 0.25 },
  { id: 8, top: "85%", left: "40%", size: 5, color: "rgba(56, 189, 248, 0.65)", duration: 13, delay: -5, baseOpacity: 0.4 },
  { id: 9, top: "15%", left: "65%", size: 4, color: "rgba(167, 139, 250, 0.55)", duration: 15, delay: -8, baseOpacity: 0.35 },
  { id: 10, top: "28%", left: "80%", size: 3.5, color: "rgba(34, 211, 238, 0.7)", duration: 12, delay: -1, baseOpacity: 0.45 },
  { id: 11, top: "42%", left: "92%", size: 4.5, color: "rgba(56, 189, 248, 0.6)", duration: 19, delay: -10, baseOpacity: 0.3 },
  { id: 12, top: "58%", left: "75%", size: 3, color: "rgba(167, 139, 250, 0.5)", duration: 14, delay: -3, baseOpacity: 0.35 },
  { id: 13, top: "72%", left: "88%", size: 5, color: "rgba(34, 211, 238, 0.65)", duration: 16, delay: -7, baseOpacity: 0.4 },
  { id: 14, top: "82%", left: "62%", size: 3.5, color: "rgba(56, 189, 248, 0.5)", duration: 13, delay: -4, baseOpacity: 0.3 },
  { id: 15, top: "90%", left: "78%", size: 4, color: "rgba(167, 139, 250, 0.6)", duration: 18, delay: -12, baseOpacity: 0.35 },
  { id: 16, top: "08%", left: "90%", size: 3, color: "rgba(34, 211, 238, 0.6)", duration: 15, delay: -6, baseOpacity: 0.3 },
  { id: 17, top: "52%", left: "50%", size: 3.5, color: "rgba(56, 189, 248, 0.45)", duration: 20, delay: -14, baseOpacity: 0.25 },
  { id: 18, top: "38%", left: "60%", size: 4, color: "rgba(167, 139, 250, 0.5)", duration: 11, delay: -2, baseOpacity: 0.3 },
  { id: 19, top: "68%", left: "45%", size: 3, color: "rgba(34, 211, 238, 0.55)", duration: 17, delay: -9, baseOpacity: 0.3 },
  { id: 20, top: "22%", left: "35%", size: 4.5, color: "rgba(56, 189, 248, 0.6)", duration: 14, delay: -5, baseOpacity: 0.35 },
];

export default function HeroParticles() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Mouse Parallax values (moves subtly only a few pixels: ±6px)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 80 };
  const parallaxX = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-1, 1], [-6, 6]), springConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setIsDesktop(finePointer && !reducedMotion);
    setPrefersReducedMotion(reducedMotion);

    if (finePointer && !reducedMotion) {
      const handleMouseMove = (e: MouseEvent) => {
        const xPct = (e.clientX / window.innerWidth) * 2 - 1;
        const yPct = (e.clientY / window.innerHeight) * 2 - 1;
        mouseX.set(xPct);
        mouseY.set(yPct);
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={isDesktop ? { x: parallaxX, y: parallaxY } : undefined}
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-[1]"
      aria-hidden="true"
    >
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className={prefersReducedMotion ? "absolute rounded-full" : "absolute rounded-full animate-particle-float"}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2.5}px 0.5px ${p.color}`,
            opacity: p.baseOpacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </motion.div>
  );
}
