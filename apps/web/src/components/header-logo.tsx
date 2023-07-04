import Image from "next/image";
import Link from "next/link";

import {cn} from "@/utils/cn";
import Logo from "/images/android-chrome-512x512.png";

type HeaderLogoProps = {
  className?: string;
};

export default function HeaderLogo({className}: HeaderLogoProps) {
  return (
    <div className={cn("relative aspect-square h-full w-full", className)}>
      <Link href="/">
        <Image src={Logo} alt="logo" sizes="200" fill />
      </Link>
    </div>
  );
}
