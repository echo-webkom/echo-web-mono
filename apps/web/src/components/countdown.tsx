"use client";

import { useEffect, useState } from "react";

import { calculateTimeLeft } from "@/lib/calculate-time-left";

type CountdownProps = {
  toDate: Date;
};

export function Countdown({ toDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(toDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(toDate));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [toDate]);

  if (timeLeft.hours === "00" && timeLeft.minutes === "00" && timeLeft.seconds === "00") {
    return null;
  }

  return (
    <div
      className="absolute right-0 top-0 flex h-full w-full items-center justify-center gap-1 rounded-md bg-primary text-xl font-semibold text-white"
      suppressHydrationWarning
    >
      <span>{timeLeft.hours}</span>
      <span>:</span>
      <span>{timeLeft.minutes}</span>
      <span>:</span>
      <span>{timeLeft.seconds}</span>
    </div>
  );
}
