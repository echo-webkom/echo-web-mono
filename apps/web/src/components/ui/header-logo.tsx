import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/images/echo-logo.png";
import { auth } from "@/auth/session";
import { cn } from "@/utils/cn";

type HeaderLogoProps = {
  className?: string;
};

export const HeaderLogo = async ({ className }: HeaderLogoProps) => {
  const user = await auth();

  return (
    <div className={cn("relative aspect-square h-16 w-auto", className)}>
      <Link href={user ? "/hjem" : "/"}>
        <Image src={Logo} alt="logo" sizes="200" fill />
      </Link>
    </div>
  );
};
