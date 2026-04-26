import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── FADE IN ────────────────────────────────────────────────────────────────
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  dir?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
  dir = "up",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const getInitial = () => {
    switch (dir) {
      case "up": return { opacity: 0, y: 50 };
      case "down": return { opacity: 0, y: -50 };
      case "left": return { opacity: 0, x: 50 };
      case "right": return { opacity: 0, x: -50 };
      default: return { opacity: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── SECTION LABEL ──────────────────────────────────────────────────────────
interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <span
      className={`text-amber-600 dark:text-[#C8962E] text-xs uppercase tracking-[0.3em] font-medium ${className}`}
    >
      {children}
    </span>
  );
}

// ─── SECTION HEADING ────────────────────────────────────────────────────────
interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
}

export function SectionHeading({ children, className = "" }: SectionHeadingProps) {
  return (
    <h2
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
      className={`text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mt-3 ${className}`}
    >
      {children}
    </h2>
  );
}

// ─── COUNTER ────────────────────────────────────────────────────────────────
interface CounterProps {
  to: number;
  suffix?: string;
  className?: string;
}

export function Counter({ to, suffix = "", className = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= to) { 
        setVal(to); 
        clearInterval(t); 
      } else {
        setVal(Math.floor(start));
      }
    }, 25);
    return () => clearInterval(t);
  }, [inView, to]);
  
  return (
    <span ref={ref} className={className}>
      {val}{suffix}
    </span>
  );
}