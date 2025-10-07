"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function AppearingText({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: { ease: "easeOut", delay: delay },
      }}
    >
      {children}
    </motion.div>
  );
}

export function InYourFace({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: 0 }}
      animate={{
        scale: [0, 1.5, 1],
        rotate: [0, -5, 5, 0],
      }}
      transition={{
        delay: delay,
        ease: "anticipate",
        duration: 1,
      }}
    >
      {children}
    </motion.div>
  );
}

const animationDuration = 5; // in seconds

export const AnimatedNumber = ({ target }: { target: number }) => {
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const updateNumber = () => {
      const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
      const progress = Math.min(elapsedTime / animationDuration, 1);
      const currentNumber = Math.floor(progress * target);
      setDisplayNumber(currentNumber);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };

    updateNumber();
  }, [target]);

  return (
    <motion.div
      initial={{ fontSize: "1em", opacity: 0 }}
      animate={{ fontSize: "13em", opacity: 1 }}
      transition={{
        duration: animationDuration,
      }}
      style={{ textAlign: "center", fontWeight: "bold" }}
    >
      {displayNumber}
    </motion.div>
  );
};
