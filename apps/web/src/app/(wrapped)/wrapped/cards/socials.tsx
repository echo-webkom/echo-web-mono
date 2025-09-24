"use client";

import { motion } from "motion/react";
import { FaRegThumbsUp, FaReply } from "react-icons/fa";
import { SlSpeech } from "react-icons/sl";

import { useSound } from "@/hooks/use-sound";
import { Confetti } from "../components/Confetti";
import { AnimatedNumber, AppearingText } from "../components/Text";
import { useUserStatsContext } from "../components/UserContext";
import { WrappedCard } from "../components/WrappedCard";
import { COMMENTS, NEW_USERS, REACTIONS, REPLIES, TOTAL_USERS } from "../stats";

export const CommentSectionCard = () => {
  return (
    <WrappedCard
      style={{
        fgColor: "bg-wrapped-purple",
        bgColor: "bg-wrapped-pink",
        colors: ["bg-wrapped-yellow", "bg-wrapped-black"],
        offX: [-20, -40],
        offY: [20, 40],
        scale: [1, 1],
        rotate: [0, 0],
      }}
    >
      <motion.div
        className="font-primary absolute top-0 left-0 m-5 text-3xl opacity-[0.05]"
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
  return (
    <WrappedCard
      style={{
        fgColor: "bg-wrapped-purple",
        bgColor: "bg-wrapped-pink",
        colors: ["bg-wrapped-blue", "bg-wrapped-orange"],
        offX: [0, 0],
        offY: [0, 0],
        scale: [1, 1],
        rotate: [-5, 10],
      }}
    >
      <div className="flex h-full w-full flex-col p-20 text-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.5 }}
          className="grid h-1/3 w-full grid-cols-3 grid-rows-2"
        >
          <div className="text-wrapped-yellow col-span-1 row-span-2 flex items-center justify-center">
            <SlSpeech className="h-1/2 w-1/2" />
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
          <div className="text-wrapped-pink col-span-1 row-span-2 flex items-center justify-center">
            <FaReply className="h-1/2 w-1/2" />
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
          <div className="text-wrapped-green col-span-1 row-span-2 flex items-center justify-center">
            <FaRegThumbsUp className="h-1/2 w-1/2" />
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

const NO_COMMENTS = [
  // De aller fleste vil få en sånn så har flere for mer variasjon
  "Du vet vi har et kommentarfelt ikkesant?",
  "Så stille man hører gresset gro...",
  "*crickets*",
];

export const YourInteractions = () => {
  const stats = useUserStatsContext();

  const { play } = useSound("/sounds/hell-nah.mp3", { autoPlay: false });
  useSound("/sounds/vine-boom.mp3", { delay: 1000 });

  const sumActivity = (stats?.reactions ?? 0) + (stats?.comments ?? 0) + (stats?.replies ?? 0);

  if (sumActivity === 0) {
    play();
  }

  const comment = (() => {
    if (sumActivity === 0) return NO_COMMENTS[Math.floor(Math.random() * NO_COMMENTS.length)];
    if (sumActivity < 5) return "En person av få ord";
    if (sumActivity < 10) return "Folket takker deg for din mening";
    return "En ekte kommentarfelt-kriger!";
  })();

  return (
    <WrappedCard
      style={{
        fgColor: "bg-wrapped-purple",
        bgColor: "bg-wrapped-pink",
        colors: ["bg-wrapped-black", "bg-wrapped-orange", "bg-wrapped-yellow"],
        offX: [20, 60, 100],
        offY: [20, 40, 60],
        scale: [1, 1, 1],
        rotate: [5, 10, 15],
      }}
    >
      <div className="grid h-full w-full grid-cols-1 grid-rows-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.5 }}
          className="row-span-1 flex items-end justify-center p-5"
        >
          <p className="text-4xl">Og du da?</p>
        </motion.div>
        <div className="row-span-1 m-5 grid grid-cols-3 grid-rows-1 rounded-2xl p-10">
          <AppearingText delay={0.6}>
            <div className="text-wrapped-yellow col-span-1 flex flex-col items-center justify-center gap-3">
              <SlSpeech className="h-16 w-16" />
              <p className="text-2xl">{stats?.comments}</p>
            </div>
          </AppearingText>
          <AppearingText delay={0.9}>
            <div className="text-wrapped-pink col-span-1 flex flex-col items-center justify-center gap-3">
              <FaReply className="h-16 w-16" />
              <p className="text-2xl">{stats?.replies}</p>
            </div>
          </AppearingText>
          <AppearingText delay={1.2}>
            <div className="text-wrapped-green col-span-1 flex flex-col items-center justify-center gap-3">
              <FaRegThumbsUp className="h-16 w-16" />
              <p className="text-2xl">{stats?.reactions}</p>
            </div>
          </AppearingText>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 2 }}
          className="row-span-1 flex items-start justify-center p-5"
        >
          <p className="text-wrapped-white text-center text-3xl">{comment}</p>
        </motion.div>
      </div>
    </WrappedCard>
  );
};

export const HowManyMembers = () => {
  return (
    <WrappedCard
      style={{
        fgColor: "bg-wrapped-purple",
        bgColor: "bg-wrapped-pink",
        colors: ["bg-wrapped-yellow", "bg-wrapped-orange"],
        offX: [0, 0],
        offY: [0, 0],
        scale: [1, 1],
        rotate: [-5, 10],
      }}
    >
      <div className="font-radley grid h-full w-full grid-cols-1 grid-rows-2 text-3xl">
        <div className="flex h-full w-full items-center justify-start p-10">
          <AppearingText delay={0.3}>I år fikk echo hele {NEW_USERS} nye medlemmer!</AppearingText>
        </div>
        <div className="flex h-full w-full flex-wrap items-center justify-end p-10 text-white">
          <AppearingText delay={1}>
            Så hvor mange<br></br>er vi nå?
          </AppearingText>
        </div>
      </div>
    </WrappedCard>
  );
};

const DRUM_ROLL = "/sounds/drumroll.wav";
const MEMBERS_MESSAGE = ["echo krigere", "nerds", "slitne studenter", "tech supportere"];

export const NumberOfUsers = () => {
  useSound(DRUM_ROLL, { delay: 700 });

  return (
    <div>
      <Confetti delay={5} />

      <div className="absolute flex h-full max-h-screen w-full flex-col items-center justify-center overflow-hidden">
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
          <AnimatedNumber target={TOTAL_USERS}></AnimatedNumber>
        </motion.div>
        <AppearingText delay={6}>
          <p className="text-5xl">
            {MEMBERS_MESSAGE[Math.floor(Math.random() * MEMBERS_MESSAGE.length)]}
          </p>
        </AppearingText>
      </div>
    </div>
  );
};
