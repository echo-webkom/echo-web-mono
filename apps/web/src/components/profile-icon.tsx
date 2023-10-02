"use client";

import Link from "next/link";
import { AvatarIcon, ExitIcon, PersonIcon } from "@radix-ui/react-icons";

import { logOutAction } from "@/app/(default)/auth/logg-ut/actions";
import { type JWTPayload } from "@/lib/session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type ProfileIconProps = {
  jwt: JWTPayload;
};

export function ProfileIcon({ jwt }: ProfileIconProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <AvatarIcon className="h-7 w-7" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mx-3 w-56">
        <DropdownMenuLabel>
          <p className="font-normal">Logget inn som</p>
          <p className="font-bold">{jwt.firstName}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/auth/profil">
            <PersonIcon className="mr-2 h-4 w-4" />
            <span>Min profil</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <button className="w-full" onClick={() => void logOutAction()}>
            <ExitIcon className="mr-2 h-4 w-4" />
            <span>Logg ut</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
