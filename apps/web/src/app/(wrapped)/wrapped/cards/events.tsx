"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { type WrappedCardProps, WrappedCard } from "../components/WrappedCard";
import { AppearingText, InYourFace } from "../components/Text";
import { BEST_EVENTS, EVENTS, EVENTS_PER_GROUP, REGISTRATIONS } from "../stats";

export const EventCards: Array<React.ReactNode> = [
  <Event0 key={0} />,
  <Event1 key={2} />,
  <Event2 key={3} />,
  <Event3 key={4} />,
  <Event4 key={5} />,
  <Event5 key={6} />,
];

function Event0() {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-orange",
    bgColor: "bg-wrapped-purple",
    colors: ["bg-wrapped-yellow", "bg-wrapped-pink"],
    offX: [0, 0],
    offY: [0, 0],
    scale: [1, 1],
    rotate: [-5, 10],
  };

  return (
    <>
      <WrappedCard props={layerProps}>
        <div className="grid w-full h-full grid-rows-2 grid-cols-1 text-3xl">
          <div className="flex w-full h-full items-center justify-start p-10">
            <AppearingText delay={0.3}>
              For et hektisk år<br></br>det har vært!
            </AppearingText>
          </div>
          <div className="flex w-full h-full items-center flex-wrap justify-end p-10 text-white">
            <AppearingText delay={1}>
              Og med så mange<br></br>flotte arrangementer.
            </AppearingText>
          </div>
        </div>
      </WrappedCard>
    </>
  );
}

function Event1() {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-orange",
    bgColor: "bg-wrapped-purple",
    colors: ["bg-wrapped-green", "bg-wrapped-pink"],
    offX: [20, 40],
    offY: [20, 40],
    scale: [1, 1],
    rotate: [0, 0],
  };

  return (
    <>
      <WrappedCard props={layerProps}>
        <div className="grid w-full h-full grid-rows-3 grid-cols-1 text-3xl">
          <div className="flex w-full h-full items-center justify-center p-10">
            <AppearingText delay={0.3}>Det ble holdt hele</AppearingText>
          </div>
          <div className="w-full h-full flex items-center justify-center">
            <InYourFace delay={0.8}>
              <p className="text-8xl bg-wrapped-yellow p-10 rounded-3xl">
                {EVENTS}
              </p>
            </InYourFace>
          </div>
          <div className="flex w-full h-full items-center flex-wrap justify-center p-10">
            <AppearingText delay={1.8}>arrangementer!</AppearingText>
          </div>
        </div>
      </WrappedCard>
    </>
  );
}

function Event2() {
  const layerProps: WrappedCardProps<3> = {
    fgColor: "bg-wrapped-orange",
    bgColor: "bg-wrapped-purple",
    colors: ["bg-wrapped-blue", "bg-wrapped-pink", "bg-wrapped-yellow"],
    offX: [20, 60, 100],
    offY: [-20, -40, -60],
    scale: [1, 1, 1],
    rotate: [-5, -10, -15],
  };

  const colors = [
    "bg-wrapped-purple",
    "bg-wrapped-blue",
    "bg-wrapped-yellow",
    "bg-wrapped-pink",
    "bg-wrapped-green",
  ];

  return (
    <>
      <WrappedCard props={layerProps}>
        <div className="flex w-full h-full items-center flex-col text-3xl overflow-hidden">
          <p className="p-10">
            Antall arrangementer<br></br>per undergruppe:
          </p>
          <div className="flex flex-col items-center gap-4 w-full h-full text-sm">
            {EVENTS_PER_GROUP.map((v, index) => {
              return (
                <motion.div
                  style={{
                    top: 0,
                    left: -index * 50 - 50,
                  }}
                  className={`relative w-full`}
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
                >
                  <div className="flex gap-2 w-full h-full items-center">
                    <div
                      className={`flex flex-grow h-full items-center justify-end p-4 ${colors[index % colors.length]} rounded-full`}
                    ></div>
                    <motion.div
                      initial={{
                        opacity: 0,
                      }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 2 + 0.1 * index,
                        duration: 0.3,
                      }}
                      className="w-1/5 flex items-center gap-1"
                    >
                      <p>{v.name}</p>
                      <p className="text-white">{v.events}</p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </WrappedCard>
    </>
  );
}

function Event3() {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-orange",
    bgColor: "bg-wrapped-purple",
    colors: ["bg-wrapped-black", "bg-wrapped-pink"],
    offX: [0, 0],
    offY: [0, 0],
    scale: [1, 1],
    rotate: [-5, 10],
  };

  return (
    <>
      <WrappedCard props={layerProps}>
        <div className="w-full h-full grid grid-cols-1 grid-rows-2">
          <div className="w-full h-full text-3xl flex justify-center gap-3 flex-col p-10">
            <AppearingText delay={0.3}>
              Wow, dere har mye<br></br>på agendaen!
            </AppearingText>
            <AppearingText delay={1}>
              <p className="text-wrapped-grey font-normal text-2xl">
                La oss se hvor mange som<br></br>faktisk var med...
              </p>
            </AppearingText>
          </div>
        </div>
      </WrappedCard>
    </>
  );
}

function Event4() {
  const layerProps: WrappedCardProps<0> = {
    fgColor: "bg-wrapped-purple shadow-none",
    bgColor: "bg-wrapped-purple",
    colors: [],
    offX: [],
    offY: [],
    scale: [],
    rotate: [],
    noParticles: true,
  };

  // MARK: star motherfucker
  return (
    <>
      {/* <motion.div
        style={{
          width: "30vh",
          height: "30vh",
          left: "calc(50vw - 15vh)",
          top: "35vh,",
        }}
        className="absolute z-40"
        initial={{
          y: -2000,
          rotate: 0,
          scale: 0,
        }}
        animate={{
          y: [null, 0, 0],
          rotate: 360,
          scale: [0, 1, 20],
        }}
        transition={{
          duration: 5,
          ease: "backOut",
          times: [0, 0.3, 1],
        }}
        exit={{
          scale: 0,
          transition: {
            duration: 0.5,
            delay: 0.5,
          },
        }}
      >
        <div className="flex w-full h-full justify-center items-center">
          <Image
            src="/wrapped/star_black.svg"
            alt=""
            width={0}
            height={0}
            style={{
              width: "50vh",
              height: "50vh",
            }}
          />
        </div>
      </motion.div> */}

      <motion.div
        className="absolute w-[30vw] h-[75vh] z-50 left-[35vw] top-[12vh]"
        initial={{
          y: -2000,
        }}
        animate={{
          y: 0,
        }}
        transition={{
          duration: 2,
          ease: "anticipate",
          delay: 0.3,
        }}
        exit={{
          y: -2000,
          transition: {
            duration: 0.8,
          },
        }}
      >
        <div className="w-full h-full grid grid-cols-1 grid-rows-2">
          <div className="flex items-center justify-center">
            <motion.div
              initial={{
                rotate: 0,
              }}
              animate={{
                rotate: [360, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Image
                src="/wrapped/star_yellow.svg"
                alt=""
                width={0}
                height={0}
                style={{
                  width: "50vh",
                  height: "50vh",
                }}
              />
            </motion.div>
            <div className="absolute">
              <p className="text-wrapped-black font-bold text-8xl text-center">
                {REGISTRATIONS}
              </p>
              <p className="text-wrapped-grey font-bold text-2xl text-center">
                PÅMELDINGER
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center font-bold text-wrapped-black text-5xl text-wrapped-white">
            <AppearingText delay={2.5}>
              <p className="font-bold text-wrapped-black text-5xl text-wrapped-white">
                For en fest!
              </p>
            </AppearingText>
            <AppearingText delay={3}>
              <p className="font-normal text-wrapped-white text-2xl opacity-50">
                Men hvilken var den største?
              </p>
            </AppearingText>
          </div>
        </div>
      </motion.div>
      <WrappedCard props={layerProps}>
        <div></div>
      </WrappedCard>
    </>
  );
}

function Event5() {
  const layerProps: WrappedCardProps<4> = {
    fgColor: "bg-wrapped-orange",
    bgColor: "bg-wrapped-purple",
    colors: [
      "bg-wrapped-green",
      "bg-wrapped-pink",
      "bg-wrapped-blue",
      "bg-wrapped-yellow",
    ],
    offX: [-80, -160, 80, 160],
    offY: [0, 0, 0, 0],
    scale: [0.9, 0.8, 0.9, 0.8],
    rotate: [-5, -10, 5, 10],
  };

  const hs = ["top-[20vh]", "top-[10vh]", "top-[25vh]"];

  return (
    <>
      <WrappedCard props={layerProps}>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <AppearingText delay={0.3}>
            <p className="text-5xl font-bold text-wrapped-black text-center">
              Top 3
            </p>
          </AppearingText>
          <div className="w-2/3 h-1/2 grid grid-cols-3 grid-rows-1 gap-2 overflow-hidden">
            {BEST_EVENTS.map((event, index) => {
              return (
                <>
                  <div className="flex w-full h-full flex-col items-center justify-end">
                    <motion.div
                      key={index}
                      initial={{
                        y: 500,
                      }}
                      animate={{
                        y: 0,
                      }}
                      transition={{
                        delay: 0.6 + index * 0.1,
                        ease: "backOut",
                        duration: 1,
                      }}
                    >
                      <div className={`w-[5vw] h-[20vw] relative ${hs[index]}`}>
                        {index !== 1 && (
                          <AppearingText delay={3 - index * 0.3}>
                            <p className="flex items-center justify-center text-wrapped-black text-center font-bold text-xl p-4">
                              {event.name}
                            </p>
                          </AppearingText>
                        )}
                        {index === 1 && (
                          <InYourFace delay={3.5}>
                            <motion.p
                              animate={{
                                rotate: [-5, 5],
                                x: [-10, 10],
                                y: [5, 0, 5],
                              }}
                              transition={{
                                delay: 4.5,
                                duration: 0.5,
                                repeat: Infinity,
                                tyoe: "spring",
                                repeatType: "mirror",
                              }}
                              className="flex text-wrapped-black text-center font-bold text-3xl items-center justify-center z-50 p-4"
                            >
                              {event.name}
                            </motion.p>
                          </InYourFace>
                        )}
                        <div className="bg-wrapped-black w-full h-full"></div>
                      </div>
                    </motion.div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </WrappedCard>
    </>
  );
}