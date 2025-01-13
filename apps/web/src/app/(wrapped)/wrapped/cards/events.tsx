"use client";

import { motion } from "motion/react";
import { TiStarburst } from "react-icons/ti";

import { useSound } from "@/hooks/use-sound";
import { AppearingText, InYourFace } from "../components/Text";
import { useUserStatsContext } from "../components/UserContext";
import { WrappedCard, type WrappedCardProps } from "../components/WrappedCard";
import { BEER, EVENTS, EVENTS_PER_GROUP, REGISTRATIONS, TOP_10_EVENTS } from "../stats";

const VINE_BOOM = "/sounds/vine-boom.mp3";

export const EventIntro = () => {
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
    <WrappedCard props={layerProps}>
      <div className="grid h-full w-full grid-cols-1 grid-rows-2 font-lexend text-3xl">
        <div className="flex h-full w-full items-center justify-start p-10">
          <AppearingText delay={0.3}>
            For et hektisk år<br></br>det har vært!
          </AppearingText>
        </div>
        <div className="flex h-full w-full flex-wrap items-center justify-end p-10 text-white">
          <AppearingText delay={1}>
            Og med så mange<br></br>flotte arrangementer.
          </AppearingText>
        </div>
      </div>
    </WrappedCard>
  );
};

export const AmountEvent = () => {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-orange",
    bgColor: "bg-wrapped-purple",
    colors: ["bg-wrapped-green", "bg-wrapped-pink"],
    offX: [20, 40],
    offY: [20, 40],
    scale: [1, 1],
    rotate: [0, 0],
  };

  useSound(VINE_BOOM, { delay: 800 });

  return (
    <>
      <WrappedCard props={layerProps}>
        <div className="grid h-full w-full grid-cols-1 grid-rows-3 text-3xl">
          <div className="flex h-full w-full items-end justify-center p-10">
            <AppearingText delay={0.3}>Det ble holdt hele</AppearingText>
          </div>
          <div className="flex h-full w-full items-center justify-center">
            <InYourFace delay={0.8}>
              <p className="text-wrapped-purple p-10 text-9xl">{EVENTS}</p>
            </InYourFace>
          </div>
          <div className="flex h-full w-full flex-wrap items-start justify-center p-10">
            <AppearingText delay={1.8}>arrangementer!</AppearingText>
          </div>
        </div>
      </WrappedCard>
    </>
  );
};

export const AmountEventPerGroup = () => {
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

  useSound("/sounds/chimes.mp3", { delay: 1800 });

  return (
    <WrappedCard props={layerProps}>
      <div className="flex h-full w-full flex-col items-center overflow-hidden font-unna text-3xl">
        <p className="p-10">
          Antall arrangementer<br></br>per undergruppe:
        </p>
        <div className="flex h-full w-full flex-col items-center gap-3 text-sm">
          {EVENTS_PER_GROUP.map((v, index) => {
            return (
              <motion.div
                style={{
                  top: 0,
                  left: -index * 30 - 50,
                }}
                className={`relative w-full`}
                key={v.name}
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
                <div className="flex h-full w-full items-center gap-2">
                  <div
                    className={`flex h-full flex-grow items-center justify-end p-4 ${colors[index % colors.length]} rounded-full`}
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
                    className="flex w-1/5 items-center gap-1"
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
  );
};

export const AgendaEvent = () => {
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
    <WrappedCard props={layerProps}>
      <div className="grid h-full w-full grid-cols-1 grid-rows-2 font-lexend">
        <div className="flex h-full w-full flex-col justify-center gap-3 p-10 text-3xl">
          <AppearingText delay={0.3}>
            Wow, dere har mye<br></br>på agendaen!
          </AppearingText>
          <AppearingText delay={1}>
            <p className="text-wrapped-grey text-2xl font-normal">
              La oss se hvor mange som<br></br>faktisk var med...
            </p>
          </AppearingText>
        </div>
      </div>
    </WrappedCard>
  );
};

export const RegistrationsCard = () => {
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

  useSound("/sounds/angry-boat.mp3", { delay: 1200 });

  return (
    <>
      <motion.div
        className="absolute left-[35vw] top-[12vh] z-50 h-[75vh] w-[30vw]"
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
        <div className="grid h-full w-full grid-cols-1 grid-rows-2">
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
              <TiStarburst className="z-40 h-[70vh] w-[70vh] fill-yellow-300" />
            </motion.div>
            <div className="absolute">
              <p className="text-wrapped-black text-center text-8xl font-bold">{REGISTRATIONS}</p>
              <p className="text-wrapped-grey text-center text-2xl font-bold">PÅMELDINGER</p>
            </div>
          </div>
          <div className="text-wrapped-black text-wrapped-white flex flex-col items-center justify-center gap-2 text-5xl font-bold">
            <AppearingText delay={2.5}>
              <p className="text-wrapped-black text-wrapped-white text-5xl font-bold">
                For en fest!
              </p>
            </AppearingText>
            <AppearingText delay={3}>
              <p className="text-wrapped-white text-2xl font-normal opacity-50">
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
};

export const BestEvent = () => {
  const layerProps: WrappedCardProps<4> = {
    fgColor: "bg-wrapped-orange",
    bgColor: "bg-wrapped-purple",
    colors: ["bg-wrapped-green", "bg-wrapped-pink", "bg-wrapped-blue", "bg-wrapped-yellow"],
    offX: [-80, -160, 80, 160],
    offY: [0, 0, 0, 0],
    scale: [0.9, 0.8, 0.9, 0.8],
    rotate: [-5, -10, 5, 10],
  };

  const hs = ["top-[20vh]", "top-[10vh]", "top-[25vh]"];

  useSound(VINE_BOOM, { delay: 2300 });
  useSound(VINE_BOOM, { delay: 2900 });
  useSound(VINE_BOOM, { delay: 3500 });

  const events = TOP_10_EVENTS.sort((a, b) => (a.registrations > b.registrations ? 0 : 1)).slice(
    0,
    3,
  );

  if (events[0] !== undefined && events[1] !== undefined) {
    [events[0], events[1]] = [events[1], events[0]];
  }

  return (
    <WrappedCard props={layerProps}>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <AppearingText delay={0.3}>
          <p className="text-wrapped-black text-center text-5xl font-bold">Top 3</p>
        </AppearingText>
        <div
          className={"grid h-1/2 w-2/3 grid-cols-3 grid-rows-1 gap-2 overflow-hidden font-primary"}
        >
          {events.map((event, index) => {
            return (
              <div
                key={event.name}
                className="flex h-full w-full flex-col items-center justify-end"
              >
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
                  <div className={`relative h-[20vw] w-[5vw] ${hs[index]}`}>
                    {index !== 1 && (
                      <AppearingText delay={3 - index * 0.3}>
                        <p className="text-wrapped-black text-md flex items-center justify-center p-4 text-center font-bold">
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
                          className="text-wrapped-black z-50 flex items-center justify-center p-4 text-center text-3xl font-bold"
                        >
                          {event.name}
                        </motion.p>
                      </InYourFace>
                    )}
                    <div className="bg-wrapped-black h-full w-full"></div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </WrappedCard>
  );
};

type Top10ItemProps = {
  index: number;
  name: string;
};

const Top10Item = ({ index, name }: Top10ItemProps) => {
  useSound("/sounds/meow.mp3", { delay: index * 300 + 1000 });
  return (
    <AppearingText key={index} delay={index * 0.3 + 1}>
      <p className="text-center text-xl">
        {index + 1}. {name}
      </p>
    </AppearingText>
  );
};

export const Top10Events = () => {
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
        <div className="flex w-full flex-col gap-2 p-10 font-unna">
          <p className="mb-7 text-center text-5xl">Top 10</p>
          {TOP_10_EVENTS.map((item, index) => {
            return <Top10Item key={item.name} index={index} name={item.name} />;
          })}
        </div>
      </WrappedCard>
    </>
  );
};

const getBedpresText = (bedpres: number | null) => {
  if (bedpres === null) return "...du får prøve igjen neste år.";

  if (bedpres > 20) return "Alt for gratis mat og drikke";
  if (bedpres > 15) return "Viva la bedpres";
  if (bedpres > 10) return "Utrolig!";
  if (bedpres > 5) return "Bedpres fan?";
  if (bedpres > 3) return "Trolig en bedpres enjoyer!";
  if (bedpres > 1) return "Du er en moderat bedpresser.";
  if (bedpres > 0) return "En er bedre enn ingen!";

  // Unreachable
  return "Bedpres konge?";
};

const getBedpresReactionText = (bedpres: number | null, actual: number | null) => {
  if (bedpres === null || actual === null) return "Outch...";

  if (actual / bedpres > 0.3) return "Ikke dumt!";
  if (actual / bedpres > 0.7) return "Imponerende!";
  if (actual / bedpres === 1) return "Raskere enn lynet!";
};

export const YourBedpresses = () => {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-orange",
    bgColor: "bg-wrapped-purple",
    colors: ["bg-wrapped-pink", "bg-wrapped-black"],
    offX: [-40, 40],
    offY: [40, -40],
    scale: [1, 1],
    rotate: [0, 0],
  };

  const stats = useUserStatsContext();
  const bedpresText = getBedpresText(stats?.registeredRegistrations ?? null);
  const bedpresActualText = getBedpresReactionText(
    stats?.registeredRegistrations ?? null,
    stats?.fastestRegistration ?? null,
  );

  return (
    <WrappedCard props={layerProps}>
      <div className="flex flex-col gap-5 p-10 font-lexend text-xl">
        <div>
          <p className="text-wrapped-black p-3 text-center text-4xl">Bedpres konge?</p>
        </div>

        <div>
          <AppearingText delay={1}>
            <p>Du var på hele {stats?.registeredRegistrations} bedriftspresentasjoner!</p>
          </AppearingText>
          <AppearingText delay={1.5}>
            <p className="text-wrapped-grey opacity-50">{bedpresText}</p>
          </AppearingText>
        </div>

        <div>
          <AppearingText delay={2}>
            <p>Din raskeste påmelding var på {stats?.fastestRegistration} sekunder</p>
          </AppearingText>
          <AppearingText delay={2.5}>
            <p className="text-wrapped-grey opacity-50">
              Det er i top{" "}
              {stats?.registrationPrecentile ? 100 - stats?.registrationPrecentile : 100}% av
              raskeste påmeldinger
            </p>
          </AppearingText>
        </div>

        <div>
          <AppearingText delay={3}>
            <p>
              Av {stats?.registrations} påmeldinger fikk du plass på{" "}
              {stats?.registeredRegistrations}
            </p>
          </AppearingText>
          <AppearingText delay={3.5}>
            <p className="text-wrapped-grey opacity-50">{bedpresActualText}</p>
          </AppearingText>
        </div>
      </div>
    </WrappedCard>
  );
};

export const BeerAmount = () => {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-orange",
    bgColor: "bg-wrapped-purple",
    colors: ["bg-wrapped-blue", "bg-wrapped-yellow"],
    offX: [0, 0],
    offY: [0, 0],
    scale: [1, 1],
    rotate: [-5, 10],
  };

  useSound("/sounds/beer.mp3");

  return (
    <WrappedCard props={layerProps}>
      <div className={"flex h-full w-full flex-col gap-5 font-unna"}>
        <div className="flex h-1/4 w-full flex-col items-center justify-center gap-3">
          <motion.p
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 3 }}
            className="text-3xl font-bold"
          >
            Og hva er en fest uten litt øl?
          </motion.p>
          <AppearingText delay={1}>
            <motion.p
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 3.3 }}
              className="text-wrapped-grey text-xl opacity-50"
            >
              Litt øl??
            </motion.p>
          </AppearingText>
        </div>
        <div className={"flex h-1/3 w-full flex-col items-center justify-center gap-5 font-unna"}>
          <AppearingText delay={2}>
            <p className="text-3xl">Dere drakk hele</p>
          </AppearingText>
          <InYourFace delay={2.5}>
            <p className={"text-wrapped-purple font-unna text-7xl font-bold"}>{BEER} liter øl</p>
          </InYourFace>
        </div>
      </div>
    </WrappedCard>
  );
};
