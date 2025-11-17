"use client";

import { useEffect, useState } from "react";

// Calculate target date: December 1st at 06:00 UTC of current year
const getTargetDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const target = new Date(`${year}-12-01T06:00:00Z`);

  // If December 1st has already passed this year, use next year
  if (target < now) {
    return new Date(`${year + 1}-12-01T06:00:00Z`);
  }

  return target;
};

const TARGET_DATE = getTargetDate();

type AocCountdownOverlayProps = {
  joinUrl: string;
  leaderboardId: string;
};

export const AocCountdownOverlay = ({ joinUrl, leaderboardId }: AocCountdownOverlayProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = TARGET_DATE.getTime() - now.getTime();

      setIsCalculated(true);

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  // Hide overlay if countdown has passed
  if (isCalculated && !timeLeft) {
    return null;
  }

  // Show loading state while calculating
  if (!isCalculated) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-lg bg-[#0f0f23]/95">
        <div className="text-center">
          <p className="text-sm text-gray-300">Laster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-lg bg-[#0f0f23]/95">
      <div className="text-center">
        <h3 className="mb-4 text-xl font-bold text-white sm:text-2xl">
          Bli med på Advent of Code!
        </h3>
        <div className="mb-4 flex items-center justify-center gap-2 font-mono text-2xl font-bold text-[#298a08] sm:text-3xl">
          <div className="flex flex-col items-center">
            <span>{String(timeLeft?.days ?? 0).padStart(2, "0")}</span>
            <span className="text-xs text-gray-400 sm:text-sm">dager</span>
          </div>
          <span>:</span>
          <div className="flex flex-col items-center">
            <span>{String(timeLeft?.hours ?? 0).padStart(2, "0")}</span>
            <span className="text-xs text-gray-400 sm:text-sm">timer</span>
          </div>
          <span>:</span>
          <div className="flex flex-col items-center">
            <span>{String(timeLeft?.minutes ?? 0).padStart(2, "0")}</span>
            <span className="text-xs text-gray-400 sm:text-sm">min</span>
          </div>
          <span>:</span>
          <div className="flex flex-col items-center">
            <span>{String(timeLeft?.seconds ?? 0).padStart(2, "0")}</span>
            <span className="text-xs text-gray-400 sm:text-sm">sek</span>
          </div>
        </div>
        <p className="mb-6 text-sm text-gray-300 sm:text-base">
          Første oppgave kommer 1. desember kl. 06:00
        </p>
        <a
          href={joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#298a08] underline hover:text-[#2fa008]"
        >
          Bli med ved å trykke her
        </a>
        <p className="mt-2 font-mono text-sm text-gray-400">Kode: {leaderboardId}</p>
      </div>
    </div>
  );
};
