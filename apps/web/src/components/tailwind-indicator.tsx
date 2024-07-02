"use client";

import { useEffect, useState } from "react";

export const TailwindIndicator = () => {
  const [h, setH] = useState(0);
  const [w, setW] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      setH(window.innerHeight);
      setW(window.innerWidth);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 flex items-center justify-center rounded-tr-lg bg-primary font-mono text-xs text-white">
      <div className="px-[4px] py-[2px]">
        <span>{String(w)}</span>
        <span>x</span>
        <span>{String(h)}</span>
      </div>
      <p>-</p>
      <div className="px-[4px] py-[2px]">
        <p className="block sm:hidden">xs</p>
        <p className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">sm</p>
        <p className="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</p>
        <p className="hidden lg:block xl:hidden 2xl:hidden">lg</p>
        <p className="hidden xl:block 2xl:hidden">xl</p>
        <p className="hidden 2xl:block">2xl</p>
      </div>
    </div>
  );
};
