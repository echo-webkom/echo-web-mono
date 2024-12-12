"use client";

import { motion } from "framer-motion";
import { FaRegThumbsUp, FaReply } from "react-icons/fa";
import { SlSpeech } from "react-icons/sl";

import { AppearingText } from "../components/Text";
import { WrappedCard, type WrappedCardProps } from "../components/WrappedCard";
import { COMMENTS, REACTIONS, REPLIES } from "../stats";

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
