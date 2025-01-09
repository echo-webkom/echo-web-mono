import Link from "next/link";

import AnimatedBg from "./AnimatedBg";

export const WrappedBanner = () => {
  return (
    <>
      <Link href="/wrapped">
        <div className="bg-wrapped-yellow absolute flex h-14 w-full cursor-pointer items-center justify-center">
          <AnimatedBg>
            <div></div>
          </AnimatedBg>
          <p className="text-wrapped-black text-xl font-bold">echo wrapped 2024 -{">"}</p>
        </div>
      </Link>
    </>
  );
};
