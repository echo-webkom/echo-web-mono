"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

export default function AnimatedBg({ children }: Props) {
  const keys = [...new Array(100).keys()];
  const folder = "/wrapped-icons/";
  const icons = ["circle.png", "square.png", "triangle.png", "star.png"];

  return (
    <>
      <div className="absolute overflow-hidden w-full h-full left-0 top-0 bg-red-300">
        {children}
        <div className="-z-10 pointer-events-none">
          {keys.map((key) => {
            const xOffset = Math.floor(Math.random() * 95);
            const yOffset = Math.floor(Math.random() * 95);

            const icon = icons[Math.floor(Math.random() * icons.length)];
            return (
              <Shape
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
    </>
  );
}

type AnimatedProps = {
  xOffset: string;
  yOffset: string;
  delay: number;
  repeatDelay: number;
  iconSrc: string;
};

export const Shape = ({
  xOffset,
  yOffset,
  delay,
  repeatDelay,
  iconSrc,
}: AnimatedProps) => (
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
