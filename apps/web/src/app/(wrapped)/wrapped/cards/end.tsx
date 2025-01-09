import Link from "next/link";

import AnimatedBg from "../components/AnimatedBg";
import { AppearingText } from "../components/Text";

export const EndScreen = () => {
  return (
    <>
      <Link href={"/hjem"}>
        <AnimatedBg>
          <div className="bg-wrapped-orange absolute flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3">
            <AppearingText delay={0.3}>
              <p className="text-wrapped-black text-5xl font-bold">Det var alt for nå!</p>
            </AppearingText>
            <AppearingText delay={1}>
              <p className="text-wrapped-grey text-3xl">Vi sees igjen neste år :)</p>
            </AppearingText>

            <AppearingText delay={1.7}>
              <p className="text-wrapped-grey m-10 text-lg">Klikk for å gå hjem</p>
            </AppearingText>
          </div>
        </AnimatedBg>
      </Link>
    </>
  );
};
