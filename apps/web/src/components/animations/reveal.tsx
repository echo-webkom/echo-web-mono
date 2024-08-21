"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

import { cn } from "@/utils/cn";

type RevealProps = {
  translateY?: number;
  translateX?: number;
  duration?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

export const Reveal = ({
  translateX = 0,
  translateY = 0,
  duration = 0.4,
  delay = 0,
  className,
  children,
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      style={{
        transform: isInView ? "none" : `translateY(${translateY}px) translateX(${translateX}px)`,
        opacity: isInView ? 1 : 0,
        transition: `all ${duration}s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
      }}
      className={cn(className)}
    >
      {children}
    </div>
  );
};
