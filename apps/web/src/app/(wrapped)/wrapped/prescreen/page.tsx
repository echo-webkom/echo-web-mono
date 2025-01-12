"use client";

import Image from "next/image";
import Link from "next/link";

import { useSound } from "@/hooks/use-sound";
import AnimatedBg from "../components/AnimatedBg";

export default () => {
  useSound("/sounds/waiting.mp3", { loop: true });
  return (
    <>
      <AnimatedBg>
        <div className="bg-wrapped-orange absolute flex h-full w-full flex-col items-center justify-center gap-5">
          <Image
            src="/images/how-to-allow-autoplay.png"
            alt="how-to-allow-autoplay"
            width={10000}
            height={0}
            className="z-50 w-3/4"
          ></Image>
          <p className="text-wrapped-black z-50 mt-20 text-2xl font-bold">
            Venligst tillat autoplay for lyd og musikk :)
          </p>
          <Link
            href="/wrapped"
            className="text-wrapped-grey z-50 text-xl opacity-50 group-hover:underline"
          >
            Ferdig {"->"}
          </Link>
        </div>
      </AnimatedBg>
    </>
  );
};
