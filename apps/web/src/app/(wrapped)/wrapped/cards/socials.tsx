"use client";

<<<<<<< HEAD
import { motion } from "motion/react";
=======
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
>>>>>>> 7658ccf6 (total members and confetti)
import { FaRegThumbsUp, FaReply } from "react-icons/fa";
import { SlSpeech } from "react-icons/sl";

import { AppearingText } from "../components/Text";
import { WrappedCard, type WrappedCardProps } from "../components/WrappedCard";
import {
  COMMENTS,
  NEW_USERS,
  REACTIONS,
  REPLIES,
  TOTAL_USERS,
  YOUR_COMMENTS,
  YOUR_REACTIONS,
  YOUR_REPLIES,
} from "../stats";

export const CommentSectionCard = () => {
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
    <WrappedCard props={layerProps}>
      <motion.div
        className="absolute left-0 top-0 text-3xl opacity-[0.03]"
        animate={{ y: -1000 }}
        transition={{ duration: 40 }}
      >
        {Array.from({ length: 200 }).map((_, index) => {
          return <p key={index}>BLA BLA BLA BLA BLA BLA BLA BLA</p>;
        })}
      </motion.div>
      <div className="flex h-full w-full flex-col items-start justify-center gap-3 p-10">
        <AppearingText delay={0.3}>
          <p className="w-full text-3xl">For en pratsom gjeng dere er!</p>
        </AppearingText>
        <AppearingText delay={1.3}>
          <p className="text-wrapped-grey w-full text-2xl font-medium">
            La oss se hvor aktive dere<br></br>har vært i kommentarfeltene...
          </p>
        </AppearingText>
      </div>
    </WrappedCard>
  );
};

export const InteractionCard = () => {
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
    <WrappedCard props={layerProps}>
      <div className="flex h-full w-full flex-col p-20 text-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.5 }}
          className="grid h-1/3 w-full grid-cols-3 grid-rows-2"
        >
          <div className="col-span-1 row-span-2 flex items-center justify-center">
            <SlSpeech className="h-1/2 w-1/2" />
            <div className="bg-wrapped-blue absolute -z-10 h-32 w-32 rounded-full"></div>
          </div>
          <div className="col-span-2 row-span-1 flex items-end justify-center p-2">
            <p className="text-wrapped-black text-5xl">{COMMENTS}</p>
          </div>
          <div className="col-span-2 row-span-1 flex items-start justify-center p-2">
            <p className="text-wrapped-grey opacity-50">kommentarer</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 1 }}
          className="grid h-1/3 w-full grid-cols-3 grid-rows-2"
        >
          <div className="col-span-1 row-span-2 flex items-center justify-center">
            <FaReply className="h-1/2 w-1/2" />
            <div className="bg-wrapped-pink absolute -z-10 h-32 w-32 rounded-full"></div>
          </div>
          <div className="col-span-2 row-span-1 flex items-end justify-center p-2">
            <p className="text-wrapped-black text-5xl">{REPLIES}</p>
          </div>
          <div className="col-span-2 row-span-1 flex items-start justify-center p-2">
            <p className="text-wrapped-grey opacity-50">replies</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 1.5 }}
          className="grid h-1/3 w-full grid-cols-3 grid-rows-2"
        >
          <div className="col-span-1 row-span-2 flex items-center justify-center">
            <FaRegThumbsUp className="h-1/2 w-1/2" />
            <div className="bg-wrapped-yellow absolute -z-10 h-32 w-32 rounded-full"></div>
          </div>
          <div className="col-span-2 row-span-1 flex items-end justify-center p-2">
            <p className="text-wrapped-black text-5xl">{REACTIONS}</p>
          </div>
          <div className="col-span-2 row-span-1 flex items-start justify-center p-2">
            <p className="text-wrapped-grey opacity-50">reaksjoner</p>
          </div>
        </motion.div>
      </div>
    </WrappedCard>
  );
};

export const YourInteractions = () => {
  const layerProps: WrappedCardProps<3> = {
    fgColor: "bg-wrapped-purple",
    bgColor: "bg-wrapped-pink",
    colors: ["bg-wrapped-black", "bg-wrapped-orange", "bg-wrapped-yellow"],
    offX: [20, 60, 100],
    offY: [20, 40, 60],
    scale: [1, 1, 1],
    rotate: [5, 10, 15],
  };

  const noComments = [
    // De aller fleste vil få en sånn så har flere for mer variasjon
    "Du vet vi har et kommentarfelt ikkesant?",
    "Så stille man hører gresset gro...",
    "*crickets*",
  ];

  const comment = (() => {
    const sumActivity = YOUR_REACTIONS + YOUR_COMMENTS + YOUR_REPLIES;

    if (sumActivity === 0) return noComments[Math.floor(Math.random() * noComments.length)];
    if (sumActivity < 5) return "En person av få ord";
    if (sumActivity < 10) return "Folket takker deg for din mening";

    // TODO: legg til flere cases, og ulike ting for ulike kombinasjoner av reaksjoner og kommentarer osv

    return "En ekte kommentarfelt-kriger!";
  })();

  return (
    <>
      <WrappedCard props={layerProps}>
        <div className="grid h-full w-full grid-cols-1 grid-rows-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.5 }}
            className="row-span-1 flex items-end justify-center p-10"
          >
            <p className="text-4xl">Og du da?</p>
          </motion.div>
          <motion.div
            initial={{ x: -1000 }}
            animate={{ x: 0 }}
            transition={{ duration: 1, delay: 1, ease: "backOut" }}
            className="bg-wrapped-yellow row-span-1 m-5 grid grid-cols-3 grid-rows-1 rounded-2xl p-5"
          >
            <div className="col-span-1 flex flex-col items-center justify-center gap-3">
              <SlSpeech className="h-1/2 w-1/2" />
              <p className="text-wrapped-grey text-2xl opacity-50">{YOUR_COMMENTS}</p>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center gap-3">
              <FaReply className="h-1/2 w-1/2" />
              <p className="text-wrapped-grey text-2xl opacity-50">{YOUR_REPLIES}</p>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center gap-3">
              <FaRegThumbsUp className="h-1/2 w-1/2" />
              <p className="text-wrapped-grey text-2xl opacity-50">{YOUR_REACTIONS}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2.5 }}
            className="row-span-1 flex items-start justify-center p-10"
          >
            <p className="text-wrapped-white text-center text-3xl">{comment}</p>
          </motion.div>
        </div>
      </WrappedCard>
    </>
  );
};

export const HowManyMembers = () => {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-purple",
    bgColor: "bg-wrapped-pink",
    colors: ["bg-wrapped-yellow", "bg-wrapped-orange"],
    offX: [0, 0],
    offY: [0, 0],
    scale: [1, 1],
    rotate: [-5, 10],
  };

  return (
    <WrappedCard props={layerProps}>
      <div className="grid h-full w-full grid-cols-1 grid-rows-2 text-3xl">
        <div className="flex h-full w-full items-center justify-start p-10">
          <AppearingText delay={0.3}>I år fikk echo hele {NEW_USERS} nye medlemmer!</AppearingText>
        </div>
        <div className="flex h-full w-full flex-wrap items-center justify-end p-10 text-white">
          <AppearingText delay={1}>
            Men hvor mange<br></br>er faktisk med?
          </AppearingText>
        </div>
      </div>
    </WrappedCard>
  );
};

const AnimatedNumber = () => {
  const [displayNumber, setDisplayNumber] = useState(0);
  const targetNumber = TOTAL_USERS;
  const animationDuration = 5; // in seconds

  useEffect(() => {
    const startTime = Date.now();
    const updateNumber = () => {
      const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
      const progress = Math.min(elapsedTime / animationDuration, 1);
      const currentNumber = Math.floor(progress * targetNumber);
      setDisplayNumber(currentNumber);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };

    updateNumber();
  }, [targetNumber]);

  return (
    <motion.div
      initial={{ fontSize: "1em", opacity: 0 }}
      animate={{ fontSize: "13em", opacity: 1 }}
      transition={{
        duration: animationDuration,
      }}
      style={{ textAlign: "center", fontWeight: "bold" }}
    >
      {displayNumber}
    </motion.div>
  );
};

const Confetti = ({ delay }: { delay: number }) => {
  return (
    <>
      <div className="absolute w-full">
        {[...new Array(100).keys()].map((index, _) => {
          const x = Math.floor(Math.random() * 99);
          const particleDelay = Math.random() * 5 + delay;
          const offx1 = Math.floor(Math.random() * 3);
          const offx2 = Math.floor(Math.random() * 3);

          const colors = [
            "bg-wrapped-yellow",
            "bg-wrapped-purple",
            "bg-wrapped-pink",
            "bg-wrapped-orange",
            "bg-wrapped-white",
            "bg-wrapped-blue",
            "bg-wrapped-green",
          ];

          const color = colors[Math.floor(Math.random() * colors.length)];

          return (
            <>
              <motion.div
                key={index}
                className={"absolute h-2 w-2 rounded-full " + color}
                style={{
                  translateX: `${x}vw`,
                }}
                initial={{ x: 0, y: -10, opacity: 1 }}
                animate={{ y: 1000, x: [0, -offx1, offx2], opacity: 0 }}
                transition={{
                  duration: 5,
                  x: { duration: 0.2, repeat: Infinity },
                  delay: particleDelay,
                  repeat: Infinity,
                }}
              ></motion.div>
            </>
          );
        })}
      </div>
    </>
  );
};

export const NumberOfUsers = () => {
  const layerProps: WrappedCardProps<2> = {
    fgColor: "bg-wrapped-pink",
    bgColor: "bg-wrapped-pink",
    colors: [],
    offX: [],
    offY: [],
    scale: [],
    rotate: [],
  };

  const membersMessage = ["echo krigere", "nerds", "slitne studenter", "tech supportere"];

  return (
    <>
      <div className="absolute flex h-full w-full flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 1, rotate: 0 }}
          animate={{
            scale: [null, 1.5, 1],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            delay: 4.9,
            ease: "anticipate",
            duration: 1,
          }}
        >
          <AnimatedNumber></AnimatedNumber>
        </motion.div>
        <AppearingText delay={6}>
          <p className="text-5xl">
            {membersMessage[Math.floor(Math.random() * membersMessage.length)]}
          </p>
        </AppearingText>
      </div>

      <Confetti delay={5}></Confetti>

      <div className="opacity-0">
        <WrappedCard props={layerProps}>
          <div></div>
        </WrappedCard>
      </div>
    </>
  );
};
