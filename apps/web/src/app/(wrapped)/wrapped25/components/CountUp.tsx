"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  decimals?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  decimals,
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getDecimalPlaces = (num: number): number => {
    if (!isFinite(num)) return 0;

    const str = num.toString();

    if (str.includes("e")) {
      const parts = str.split("e");
      const base = parts[0];
      const exponent = parts[1];

      const decimals = base ? (base.split(".")[1]?.length ?? 0) : 0;
      const expValue = exponent ? parseInt(exponent) : 0;

      const count = decimals - expValue;
      return count > 0 ? count : 0;
    }

    return str.split(".")[1]?.length ?? 0;
  };

  const finalDecimals = decimals ?? Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = (direction === "down" ? to : from).toFixed(finalDecimals);
    }
  }, [from, to, direction, finalDecimals]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === "function") {
            onEnd();
          }
        },
        delay * 1000 + duration * 1000,
      );

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const options: Intl.NumberFormatOptions = {
          useGrouping: !!separator,
          minimumFractionDigits: finalDecimals,
          maximumFractionDigits: finalDecimals,
        };

        const formattedNumber = Intl.NumberFormat("en-US", options).format(latest);

        ref.current.textContent = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;
      }
    });

    return () => unsubscribe();
  }, [springValue, separator, finalDecimals]);

  return <span className={className} ref={ref} />;
}
