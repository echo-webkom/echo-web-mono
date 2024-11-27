"use client";

import Image from "next/image";
import { getMonth } from "date-fns";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import { Snowflake } from "../icons/snowflake";

type AnimatedIconsProps = {
  n: number;
  children: React.ReactNode;
};

export const AnimatedIcons = ({ n, children }: AnimatedIconsProps) => {
  const month = getMonth(new Date());
  // Halloween
  if (month !== 9) return <>{children}</>;

  const keys = [...new Array(n).keys()];
  const folder = "/halloween-icons/";
  const icons = ["ghost.svg", "pumpkin.svg", "skull.svg"];

  return (
    <div className="h-full w-full">
      <div className="relative min-h-screen w-full">{children}</div>
      <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
        {keys.map((key) => {
          const xOffset = Math.floor(Math.random() * 95);
          const yOffset = Math.floor(Math.random() * 95);

          const icon = icons[Math.floor(Math.random() * icons.length)];
          return (
            <AnimatedIcon
              delay={key * 0.5}
              repeatDelay={15}
              xOffset={`${xOffset}%`}
              yOffset={`${yOffset}%`}
              key={key}
              iconSrc={`${folder}${icon}`}
            />
          );
        })}
      </div>
    </div>
  );
};

type AnimatedIconProps = {
  xOffset: string;
  yOffset: string;
  delay: number;
  repeatDelay: number;
  iconSrc: string;
};

export const AnimatedIcon = ({
  xOffset,
  yOffset,
  delay,
  repeatDelay,
  iconSrc,
}: AnimatedIconProps) => (
  <motion.div
    style={{
      position: "absolute",
      top: xOffset,
      left: yOffset,
      zIndex: 0,
    }}
    initial={{ opacity: 0 }}
    animate={{
      x: "200%",
      y: ["0%", "20%", "-10%", "-5%"],
      opacity: [null, 1, 1, 1, 1, 0],
      rotate: [null, -10, 2, -5],
    }}
    transition={{
      delay: delay,
      repeatDelay: repeatDelay,
      duration: 5,
      repeat: Number.POSITIVE_INFINITY,
    }}
  >
    <Image src={iconSrc} alt="" height={50} width={50} />
  </motion.div>
);

export const AnimatedSnowfall = ({ n, children }: AnimatedIconsProps) => {
  const date = new Date();
  const month = date.getMonth();
  const { theme } = useTheme();

  // Christmas
  if (!((month === 10 && date.getDate() >= 16) || month === 11)) return <>{children}</>;

  const keys = [...new Array(n).keys()];
  const colors = theme === "light" ? ["#1C274C"] : ["#F3F7F2"]; // Can add different colors for the snowflakes here

  return (
    <div className="h-full w-full">
      <div className="relative min-h-screen w-full">{children}</div>
      <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
        {keys.map((key) => {
          const offset = Math.floor(Math.random() * 95);

          const color = colors[Math.floor(Math.random() * colors.length)]!;
          return (
            <AnimatedSnowFlake
              delay={key * 0.5}
              repeatDelay={15}
              offset={`${offset}%`}
              key={key}
              color={color}
            />
          );
        })}
      </div>
    </div>
  );
};

type AnimatedSnowFlakeProps = {
  offset: string;
  delay: number;
  repeatDelay: number;
  color: string;
};

export const AnimatedSnowFlake = ({
  offset,
  delay,
  repeatDelay,
  color,
}: AnimatedSnowFlakeProps) => (
  <motion.div
    style={{
      position: "absolute",
      left: offset,
      zIndex: 0,
    }}
    initial={{ opacity: 0, y: "-10%" }}
    animate={{
      y: "500%",
      opacity: [0, 1, 1, 1, 1, 1, 0],
      rotate: [0, 10, -10, 0],
    }}
    transition={{
      delay: delay,
      repeatDelay: repeatDelay,
      duration: 10,
      repeat: Number.POSITIVE_INFINITY,
    }}
  >
    <Snowflake color={color} />
  </motion.div>
);
