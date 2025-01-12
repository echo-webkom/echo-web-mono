"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

import AnimatedBg from "./AnimatedBg";

export const WrappedBanner = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {/* When on desktop */}
      <div className="hidden lg:block">
        <Link href="/wrapped/prescreen">
          <div className="bg-wrapped-yellow absolute flex h-14 w-full cursor-pointer items-center justify-center">
            <AnimatedBg />
            <p className="text-wrapped-black flex items-center gap-3 text-xl font-bold">
              echo wrapped 2024 <LuArrowRight />
            </p>
          </div>
        </Link>
      </div>

      {/* When on mobile */}
      <div className="block lg:hidden">
        <div className="bg-wrapped-yellow absolute flex h-14 w-full cursor-pointer items-center justify-center">
          <AnimatedBg size={10} />
          <p className="text-wrapped-black text-sm font-bold">
            echo wrapped er her. Gå på PCen for å se!
          </p>
        </div>
      </div>
    </div>
  );
};
