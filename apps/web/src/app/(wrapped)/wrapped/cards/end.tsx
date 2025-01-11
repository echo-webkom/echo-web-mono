import { Ranchers } from "next/font/google";
import Link from "next/link";

import AnimatedBg from "../components/AnimatedBg";
import { AppearingText } from "../components/Text";

const ranchers = Ranchers({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
});

// Use then stop sounds is added
// const FEIN = "/sounds/fein.mp3";

export const EndScreen = () => {
  // useSound(FEIN);

  return (
    <>
      <Link href={"/hjem"}>
        <AnimatedBg>
          <div
            className={
              "bg-wrapped-orange absolute flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 " +
              ranchers.className
            }
          >
            <AppearingText delay={0.3}>
              <p className="text-wrapped-black text-5xl font-bold">Det var alt for nå!</p>
            </AppearingText>
            <AppearingText delay={1}>
              <p className="text-wrapped-grey text-3xl">Vi sees igjen neste år :)</p>
            </AppearingText>

            <AppearingText delay={1.7}>
              <p className="text-wrapped-grey m-10 font-primary text-lg">Klikk for å gå hjem</p>
            </AppearingText>
          </div>
        </AnimatedBg>
      </Link>
    </>
  );
};
