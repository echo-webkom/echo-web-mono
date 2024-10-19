"use client";

import Image from "next/image";
import { getMonth } from "date-fns";
import { motion } from "framer-motion";

type AnimatedIconsProps = {
  n: number;
  children: React.ReactNode;
};

export const AnimatedIcons = ({ n, children }: AnimatedIconsProps) => {
  const month = getMonth(new Date());
  // Only for Halloween, no animated icons for Christmas
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
