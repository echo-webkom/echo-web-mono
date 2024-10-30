import { motion } from "framer-motion";
import { type WrappedCardProps, WrappedCard } from "../components/WrappedCard";

export function Event0() {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-orange",
    colors: ["bg-wrapped-yellow", "bg-wrapped-pink"],
    offX: [0, 0],
    offY: [0, 0],
    rotate: [-5, 10],
  };

  return (
    <>
      <WrappedCard props={layerProps}>
        <div className="grid w-full h-full grid-rows-2 grid-cols-1 text-3xl">
          <div className="flex w-full h-full items-center justify-start p-10">
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { ease: "easeOut", delay: 0.3 },
              }}
            >
              For et hektisk år<br></br>det har vært!
            </motion.p>
          </div>
          <div className="flex w-full h-full items-center flex-wrap justify-end p-10 text-white">
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { ease: "easeOut", delay: 1.3 },
              }}
            >
              Og med så mange<br></br>flotte arrangementer.
            </motion.p>
          </div>
        </div>
      </WrappedCard>
    </>
  );
}
