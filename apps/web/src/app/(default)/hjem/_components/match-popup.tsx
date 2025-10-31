"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Confetti from "react-confetti";

import bouvetLogo from "@/assets/images/bouvet-logo.png";
import echoLogo from "@/assets/images/echo-logo.png";
import fonnGroupLogo from "@/assets/svg/fonn-group-black-logo.svg";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { useWindowSize } from "@/hooks/use-window-size";

const LOCALSTORAGE_KEY = "echo-partnership-popup-seen";

export function MatchPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const windowSize = useWindowSize();
  const isMouted = useIsMounted();
  const searchParams = useSearchParams();

  useEffect(() => {
    const forceShow = searchParams.get("showPopup") === "true";
    const hasSeenPopup = localStorage.getItem(LOCALSTORAGE_KEY);
    const is3rdOfNovember2025 = new Date().toISOString().startsWith("2025-11-03");

    if (forceShow || (!hasSeenPopup && is3rdOfNovember2025)) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(LOCALSTORAGE_KEY, "true");
  };

  if (!isVisible || !isMouted) return null;

  return (
    <>
      <div
        className="animate-in fade-in fixed inset-0 z-50 h-svh bg-black/80 transition-opacity duration-500"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={60}
          colors={["#FF6B9D", "#C44569", "#FFC048", "#FFD700", "#FF69B4", "#FFB6C1"]}
          recycle
        />
      </div>

      <div className="pointer-events-none fixed inset-0 z-50 flex h-svh items-center justify-center p-4">
        <div className="animate-in zoom-in-95 fade-in pointer-events-auto w-full max-w-3xl transform transition-all duration-700">
          <div className="relative px-4 py-12 md:px-12 md:py-16">
            <div className="space-y-8 text-center">
              <h1
                className="animate-in zoom-in-50 text-6xl text-white drop-shadow-lg duration-1000 md:text-8xl"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                It&apos;s a Match!
              </h1>

              <p className="mx-auto max-w-2xl px-2 text-lg text-white/90 italic md:px-8 md:text-2xl">
                echo, Bouvet og Fonn Group har likt hverandre!
              </p>

              <p className="mx-auto max-w-2xl px-2 text-lg font-light text-white/90 md:px-8 md:text-2xl">
                Fra gode venner til sammarbeidspartnere. Vi har nå inngått en samarbeidsavatale med
                Bouvet og Fonn Group! ❤️
              </p>

              <div className="flex items-center justify-center gap-2 py-8 md:gap-8">
                <div className="animate-in slide-in-from-left flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white p-3 shadow-xl duration-700 md:h-36 md:w-36 md:p-6">
                  <Image
                    src={bouvetLogo}
                    alt="Bouvet logo"
                    className="h-full w-full object-contain"
                    width={144}
                    height={144}
                  />
                </div>
                <div className="animate-in zoom-in flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white p-3 shadow-xl duration-700 md:h-36 md:w-36 md:p-6">
                  <Image
                    src={echoLogo}
                    alt="echo logo"
                    className="h-full w-full object-contain"
                    width={144}
                    height={144}
                  />
                </div>
                <div className="animate-in slide-in-from-right flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white p-3 shadow-xl duration-700 md:h-36 md:w-36 md:p-6">
                  <Image
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    src={fonnGroupLogo}
                    alt="Fonn Group logo"
                    className="h-full w-full object-contain"
                    width={144}
                    height={144}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <button
                  onClick={handleClose}
                  className="w-full py-3 font-medium text-white/80 transition-colors hover:text-white"
                >
                  Lukk
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
