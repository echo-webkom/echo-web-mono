import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/echo-logo.png";
import { cn } from "@/utils/cn";

type HeaderLogoProps = {
  className?: string;
};

export const HeaderLogo = ({ className }: HeaderLogoProps) => {
  return (
    <div className={cn("relative aspect-square h-16 w-auto", className)}>
      <Link href="/">
        <Image src={Logo} alt="logo" sizes="200" fill />
      </Link>
    </div>
  );
};
