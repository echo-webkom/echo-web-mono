import { Ranchers } from "next/font/google";
import Link from "next/link";

import { useSound } from "@/hooks/use-sound";
import AnimatedBg from "../components/AnimatedBg";
import { AppearingText } from "../components/Text";

const GET_OUT = "/sounds/get-out.mp3";

const ranchers = Ranchers({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
});

export const EndScreen = () => {
  useSound(GET_OUT, { delay: 2000 });

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
