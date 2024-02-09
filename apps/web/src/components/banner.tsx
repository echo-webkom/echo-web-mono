"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";



const calculateTimeLeft = (date: Date) => {
  const now = new Date().getTime();
  const difference = date.getTime() - now;

  if (difference <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days: days.toString().padStart(2, "0"),
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
};

const targetDate = new Date("2024-02-09T20:00:00");

export default function LaunchPartyBanner() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  const itsTime = new Date() >= targetDate;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="flex h-full w-full items-center justify-center space-x-3 rounded-md bg-primary bg-gradient-to-r from-red-500 to-red-700 py-4 text-base font-semibold text-white sm:space-x-5 sm:text-2xl"
      suppressHydrationWarning
    >
      <Confetti className="fixed left-0 top-0 z-[60] min-h-screen w-full" hidden={!itsTime} />
       {itsTime ? (<div className="text-center">🎉 WOOOO NY NETTSIDE!!!!! (lat som du aldri har sett den før og gå helt crazy) 🎉</div>) : (
      <>
      <span>🎉 LAUNCH PARTY 🎉</span>
      <span className="space-x-1 sm:space-x-2">
        <span>{timeLeft.days}</span>
        <span>:</span>
        <span>{timeLeft.hours}</span>
        <span>:</span>
        <span>{timeLeft.minutes}</span>
        <span>:</span>
        <span>{timeLeft.seconds}</span>
      </span>
      </>
      )}
    </div>
  );
}
