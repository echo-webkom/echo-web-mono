import { motion } from "framer-motion";
import { type WrappedCardProps, WrappedCard } from "../components/WrappedCard";

export const EventCards: Array<React.ReactNode> = [
  <Event2 key={0} />,
  <Event0 key={0} />,
  <Event1 key={0} />,
];

function Event0() {
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

function Event1() {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-orange",
    colors: ["bg-wrapped-green", "bg-wrapped-pink"],
    offX: [20, 40],
    offY: [20, 40],
    rotate: [0, 0],
  };

  return (
    <>
      <WrappedCard props={layerProps}>
        <div className="grid w-full h-full grid-rows-3 grid-cols-1 text-3xl">
          <div className="flex w-full h-full items-center justify-center p-10">
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { ease: "easeOut", delay: 0.3 },
              }}
            >
              Det ble holdt hele
            </motion.p>
          </div>
          <div className="w-full h-full flex items-center justify-center">
            <motion.p
              className="text-8xl bg-wrapped-yellow p-10 rounded-3xl"
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: [0, 3, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                delay: 0.6,
                ease: "anticipate",
                duration: 1,
              }}
            >
              1234
            </motion.p>
          </div>
          <div className="flex w-full h-full items-center flex-wrap justify-center p-10">
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { ease: "easeOut", delay: 1.8 },
              }}
            >
              arrangementer!
            </motion.p>
          </div>
        </div>
      </WrappedCard>
    </>
  );
}

function Event2() {
  const layerProps: WrappedCardProps<3> = {
    fgColor: "bg-wrapped-orange",
    colors: ["bg-wrapped-blue", "bg-wrapped-pink", "bg-wrapped-yellow"],
    offX: [20, 60, 100],
    offY: [-20, -40, -60],
    rotate: [-5, -10, -15],
  };

  const colors = [
    "bg-wrapped-green",
    "bg-wrapped-purple",
    "bg-wrapped-pink",
    "bg-wrapped-blue",
    "bg-wrapped-yellow",
  ];

  const underGrupper = [
    "BEDKOM",
    "WEBKOM",
    "HYGGKOM",
    "TILDE",
    "GNIST",
    "MAKERSPACE",
    "ESC",
  ];

  return (
    <>
      <WrappedCard props={layerProps}>
        <div className="flex w-full h-full items-center flex-col text-3xl overflow-hidden">
          <p className="p-10">
            Antall arrangementer<br></br>per undergruppe:
          </p>
          <div className="flex flex-col items-center gap-4 w-full h-full text-sm">
            {underGrupper.map((v, index) => {
              return (
                <motion.div
                  style={{
                    top: 0,
                    left: -index * 50 - 100,
                  }}
                  className={`relative p-2 w-full rounded-r-full ${colors[index % colors.length]}`}
                  key={index}
                  initial={{
                    x: -500,
                  }}
                  animate={{
                    x: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: 0.9 + index * 0.1,
                    type: "spring",
                    stiffness: 50,
                  }}
                ></motion.div>
              );
            })}
          </div>
        </div>
      </WrappedCard>
    </>
  );
}
