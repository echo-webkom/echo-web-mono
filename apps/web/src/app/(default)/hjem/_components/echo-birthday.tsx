"use client";

import { useEffect, useEffectEvent, useState } from "react";

import { useIsMounted } from "@/hooks/use-is-mounted";
import ConfettiForBDay from "./confetti";

export default function EchoBirthdayBanner() {
  const today = new Date();
  const echoBirthday = new Date(today.getFullYear(), 10, 7);
  const countDownStart = new Date(today.getFullYear(), 10, 1);
  const [timeDifference, setTimeDifference] = useState(0);
  const afterBirthday = new Date(today.getFullYear(), 10, 8);

  // Durations in milliseconds
  const startDate = new Date(today.getFullYear(), 9, 24);
  const progressDuration = echoBirthday.getTime() - startDate.getTime();
  const progressElapsed = new Date().getTime() - startDate.getTime();

  //calcualte percenrtage complete
  let percenrtage = 0;
  if (progressDuration > 0) {
    percenrtage = (progressElapsed / progressDuration) * 100;
  }

  //progressbar completion style
  const progressbar = Math.max(0, Math.min(100, percenrtage));

  const onTick = useEffectEvent(() => {
    setTimeDifference(echoBirthday.getTime() - new Date().getTime());
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      onTick();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const diffDays = Math.floor(timeDifference / (1000 * 3600 * 24));
  const diffHours = Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600));
  const diffMinutes = Math.floor((timeDifference % (1000 * 3600)) / (1000 * 60));

  const diffSeconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  const isMounted = useIsMounted(); // importer fra "@/hooks/use-is-mounted"

  if (!isMounted) {
    return null;
  }

  if (echoBirthday > today && countDownStart < today) {
    return (
      <div className="mt-10 -mb-20">
        <div className="mx-auto w-full px-3 sm:w-[50vw]">
          <p className="p-4 text-center text-xl font-semibold sm:text-2xl">
            🎉 echo bursdag nedtelling 🎈
          </p>

          {/* progress bar */}
          <div className="border-border relative h-8 w-full overflow-hidden rounded-full border-2 bg-yellow-200">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-sky-200"
              style={{ width: `${progressbar}%` }}
            />
            <p className="pointer-events-none absolute inset-0 grid place-items-center text-sm font-semibold text-black sm:text-lg">
              {diffDays} dager {diffHours} timer {diffMinutes} min {diffSeconds} sek{" "}
            </p>
          </div>
        </div>
      </div>
    );
  } else if (echoBirthday < today && today < afterBirthday) {
    return (
      <div className="bg-secondary -mb-20 flex h-14 items-center justify-center text-center">
        <h1 className="text-md mt-3 font-extrabold text-[#c26ce4] sm:mt-0 sm:text-2xl">
          🎉 Gratulerer med dagen echo! 🎉
        </h1>
        <ConfettiForBDay />
      </div>
    );
  } else {
    return null;
  }
}
