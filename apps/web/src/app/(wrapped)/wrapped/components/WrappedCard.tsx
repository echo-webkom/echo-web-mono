"use client";

import { motion } from "motion/react";
import { LuCircle, LuSquare, LuStar, LuTriangle } from "react-icons/lu";

import { useSound } from "@/hooks/use-sound";

type ArrayOfLength<T, L extends number> = ([T, ...Array<T>] & { length: L }) | [];

const ICONS = [LuStar, LuCircle, LuSquare, LuTriangle];

export type WrappedCardStyle<C extends number> = {
  offX: ArrayOfLength<number, C>;
  offY: ArrayOfLength<number, NoInfer<C>>;
  rotate: ArrayOfLength<number, NoInfer<C>>;
  scale: ArrayOfLength<number, NoInfer<C>>;
  colors: ArrayOfLength<string, NoInfer<C>>;
  fgColor: string;
  bgColor: string;
  noParticles?: boolean;
};

type WrappedCardProps<C extends number> = {
  style: WrappedCardStyle<C>;
  children?: React.ReactNode;
};

function CardLayers<C extends number>({ style, children }: WrappedCardProps<C>) {
  return (
    <div className="h-full w-full">
      <motion.div
        className={`absolute ${style.fgColor} text-wrapped-black z-10 h-full w-full overflow-hidden font-slab font-bold shadow`}
      >
        {children}
      </motion.div>

      {style.colors.map((color, index) => {
        const variants = {
          hidden: {
            scale: 1,
            rotate: 0,
            x: 0,
            y: 0,
          },
          show: {
            rotate: style.rotate[index],
            x: style.offX[index],
            y: style.offY[index],
            scale: style.scale[index],
            transition: {
              ease: "backOut",
            },
          },
        };

        return (
          <motion.div
            style={{ zIndex: -index }}
            key={index}
            className={`absolute left-0 top-0 h-full w-full ${color} shadow`}
            variants={variants}
          />
        );
      })}
    </div>
  );
}

function CardBackdrop() {
  const length = 10 + Math.floor(Math.random() * 4);
  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: Math.floor(Math.random() * 20 - 10) }}
      transition={{
        duration: 10,
      }}
      className="absolute left-1/2 top-1/2 -z-50"
    >
      {[...new Array(length).keys()].map((_, index) => {
        const angle = (((360 / length) * (index + 1)) / 360) * Math.PI * 2;
        const dist = 600;

        return (
          <Particle
            key={index}
            x={Math.cos(angle) * dist}
            y={Math.sin(angle) * dist}
            duration={Math.random() * 3}
          />
        );
      })}
      {[...new Array(length).keys()].map((_, index) => {
        const angle = (((360 / length) * (index + 1)) / 360) * Math.PI * 2;
        const dist = 800;

        return (
          <Particle
            key={index}
            x={Math.cos(angle) * dist}
            y={Math.sin(angle) * dist}
            duration={Math.random() * 2}
          />
        );
      })}
      {[...new Array(length * 2).keys()].map((_, index) => {
        const angle = (((360 / (length * 2)) * (index + 1)) / 360) * Math.PI * 2;
        const dist = 1000;

        return (
          <Particle
            key={index}
            x={Math.cos(angle) * dist}
            y={Math.sin(angle) * dist}
            duration={Math.random() * 3}
          />
        );
      })}
    </motion.div>
  );
}

type ParticleProps = {
  x: number;
  y: number;
  duration: number;
};

function Particle({ x, y, duration }: ParticleProps) {
  const Icon = ICONS[Math.floor(Math.random() * ICONS.length)]!;

  return (
    <motion.div
      className="absolute h-10 w-10"
      initial={{
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 0,
      }}
      animate={{
        x: [Math.floor(x / 1.5), Math.floor(x)],
        y: [Math.floor(y / 1.5), Math.floor(y)],
        opacity: [0, 0.3, 1, 0],
        rotate: 360,
      }}
      exit={{
        opacity: [null, 0],
        transition: {
          duration: 0.05,
        },
      }}
      transition={{
        duration: 7 + duration,
        times: [0, 0.05, 0.9, 1],
        ease: "linear",
      }}
    >
      <Icon className="h-10 w-10 opacity-50" />
    </motion.div>
  );
}

const mainVariants = {
  hidden: {
    scale: 0,
  },
  show: {
    scale: 1,
    transition: {
      duration: 0.2,
      delayChildren: 0.2,
    },
  },
  exit: {
    scale: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export function WrappedCard<C extends number>({ style, children }: WrappedCardProps<C>) {
  useSound("/sounds/swoosh.flac", { volume: 0.4 });

  return (
    <div
      className={`relative left-0 top-0 -z-50 h-[100vh] w-[100vw] overflow-hidden ${style.bgColor}`}
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden">
        <motion.div
          initial="hidden"
          animate="show"
          exit="exit"
          variants={mainVariants}
          className="relative h-[660px] w-full max-w-[475px] select-none"
        >
          {!style.noParticles && <CardBackdrop />}
          <CardLayers style={style}>{children}</CardLayers>
        </motion.div>
      </div>
    </div>
  );
}
