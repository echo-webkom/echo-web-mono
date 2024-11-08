import { motion } from "framer-motion";
import { WrappedCard, type WrappedCardProps } from "../components/WrappedCard";
import { AppearingText } from "../components/Text";
import Image from "next/image";

export const SocialCards: Array<React.ReactNode> = [
  <Social0 key={0} />,
  <Social1 key={1} />,
];

function Social0() {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-purple",
    bgColor: "bg-wrapped-pink",
    colors: ["bg-wrapped-yellow", "bg-wrapped-black"],
    offX: [-20, -40],
    offY: [20, 40],
    scale: [1, 1],
    rotate: [0, 0],
  };

  return (
    <>
      <WrappedCard props={layerProps}>
        <motion.div
          className="absolute top-0 left-0 text-3xl opacity-[0.03]"
          animate={{ y: -1000 }}
          transition={{ duration: 40 }}
        >
          {Array.from({ length: 200 }).map((_, index) => {
            return <p key={index}>BLA BLA BLA BLA BLA BLA BLA BLA</p>;
          })}
        </motion.div>
        <div className="flex w-full h-full flex-col items-start justify-center p-10 gap-3">
          <AppearingText delay={0.3}>
            <p className="text-3xl w-full">For en pratsom gjeng dere er!</p>
          </AppearingText>
          <AppearingText delay={1.3}>
            <p className="font-medium text-2xl w-full text-wrapped-grey">
              La oss se hvor aktive dere<br></br>har vært i kommentarfeltene...
            </p>
          </AppearingText>
        </div>
      </WrappedCard>
    </>
  );
}

function Social1() {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-purple",
    bgColor: "bg-wrapped-pink",
    colors: ["bg-wrapped-blue", "bg-wrapped-orange"],
    offX: [0, 0],
    offY: [0, 0],
    scale: [1, 1],
    rotate: [-5, 10],
  };
  return (
    <>
      <WrappedCard props={layerProps}>
        <div className="w-full h-full flex flex-col items-center justify-center p-10 gap-10">
          <div className="flex w-full items-center gap-5">
            <div className="h-full">
              <Image
                src="/wrapped/star.png"
                alt=""
                width={50}
                height={0}
              ></Image>
            </div>
            <p>999 kommentarer</p>
          </div>
          <div className="flex w-full items-center gap-5">
            <div className="h-full">
              <Image
                src="/wrapped/star.png"
                alt=""
                width={50}
                height={0}
              ></Image>
            </div>
            <p>999 kommentarer</p>
          </div>
          <div className="flex w-full items-center gap-5">
            <div className="h-full">
              <Image
                src="/wrapped/star.png"
                alt=""
                width={50}
                height={0}
              ></Image>
            </div>
            <p>999 kommentarer</p>
          </div>
        </div>
      </WrappedCard>
    </>
  );
}
