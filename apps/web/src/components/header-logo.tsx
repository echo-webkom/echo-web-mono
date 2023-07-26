import Image from "next/image";
import Link from "next/link";

import {cn} from "@/utils/cn";

interface HeaderLogoProps {
  className?: string;
}

export default function HeaderLogo({className}: HeaderLogoProps) {
  const logo = "/images/android-chrome-512x512.png";

  return (
    <div className={cn("relative aspect-square h-full w-full", className)}>
      <Link href="/">
        <Image src={logo} alt="logo" sizes="200" fill />
      </Link>
    </div>
  );
}
