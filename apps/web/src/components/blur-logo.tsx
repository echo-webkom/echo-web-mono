"use client";

import { type ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import EchoLogo from "@/assets/images/echo-logo.png";
import { cn } from "@/utils/cn";

export type BlurLogoProps = ComponentPropsWithoutRef<typeof motion.div> & {
  width: number;
  height: number;
};

export const BlurLogo = ({ width, height, className, ...rest }: BlurLogoProps) => {
  return (
    <motion.div className="absolute z-[-10]" {...rest}>
      <Image
        src={EchoLogo}
        alt="echo"
        width={width}
        height={height}
        className={cn(`blur-3xl`, className)}
      />
    </motion.div>
  );
};
