"use client";

import { motion } from "motion/react";
import { LuCircle, LuSquare, LuStar, LuTriangle } from "react-icons/lu";

const icons = [LuStar, LuCircle, LuSquare, LuTriangle];

type Props = {
  children?: React.ReactNode;
  count?: number;
  size?: number;
};

export default function AnimatedBg({ children, count = 100, size = 50 }: Props) {
  const keys = [...new Array(count).keys()];
  const colors = ["#a484e9", "#31bff3", "#f4889a", "#ffaf68", "#f6e683", "#79d45e"];

  return (
    <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
      {children}
      <div className="pointer-events-none -z-10">
        {keys.map((key) => {
          const xOffset = Math.floor(Math.random() * 95);
          const yOffset = Math.floor(Math.random() * 95);
          const Icon = icons[Math.floor(Math.random() * icons.length)]!;
          const color = colors[Math.floor(Math.random() * colors.length)];

          return (
            <Shape
              delay={key * 0.5}
              repeatDelay={15}
              xOffset={`${xOffset}%`}
              yOffset={`${yOffset}%`}
              key={key}
            >
              <Icon color={color} size={size} />
            </Shape>
          );
        })}
      </div>
    </div>
  );
}

type AnimatedProps = {
  xOffset: string;
  yOffset: string;
  delay: number;
  repeatDelay: number;
  children: React.ReactNode;
};

export const Shape = ({ xOffset, yOffset, delay, repeatDelay, children }: AnimatedProps) => (
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
    {children}
  </motion.div>
);
