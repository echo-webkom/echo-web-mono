"use client";

import { useEffect, useState } from "react";

const calculateTimeLeft = (date: Date) => {
  const now = new Date().getTime();
  const difference = date.getTime() - now;

  if (difference <= 0) {
    return { hours: "00", minutes: "00", seconds: "00" };
  }

  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
};

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
