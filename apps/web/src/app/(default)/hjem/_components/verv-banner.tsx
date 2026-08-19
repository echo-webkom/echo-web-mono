"use client";

import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useRef } from "react";

export default function VervBanner() {
  const x = useMotionValue(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, delta) => {
    const contentWidth = contentRef.current?.offsetWidth;

    if (!contentWidth) return;

    const speed = 40; // pixels per second
    const nextX = x.get() - (speed * delta) / 1000;

    // Reset by exactly one content width.
    x.set(nextX <= -contentWidth ? nextX + contentWidth : nextX);
  });

  const content = (
    <div ref={contentRef} className="flex shrink-0 whitespace-nowrap">
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className="px-6">
          SØK VERV NÅ!
        </span>
      ))}
    </div>
  );

  return (
    <a
      href="https://verv.echo-webkom.no"
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full overflow-hidden bg-linear-to-r from-blue-400 to-yellow-300 py-2 text-xl font-medium text-black shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      <motion.div style={{ x }} className="flex shrink-0">
        {content}

        <div className="flex shrink-0 whitespace-nowrap">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className="px-6">
              SØK VERV NÅ!
            </span>
          ))}
        </div>
      </motion.div>
    </a>
  );
}
