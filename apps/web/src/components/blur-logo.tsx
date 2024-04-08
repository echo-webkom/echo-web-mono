import Image from "next/image";

import EchoLogo from "@/assets/images/echo-logo.png";
import { cn } from "@/utils/cn";

export type BlurLogoProps = {
  width: number;
  height: number;
  top: number;
  className?: string;
} & (
  | {
      left: number;
    }
  | {
      right: number;
    }
);

export function BlurLogo({ width, height, className, ...rest }: BlurLogoProps) {
  return (
    <Image
      src={EchoLogo}
      alt="echo"
      width={width}
      height={height}
      className={cn(`blur-3xl`, className)}
      style={{
        position: "absolute",
        zIndex: -10,
        ...rest,
      }}
    />
  );
}
