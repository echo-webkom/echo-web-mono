"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  RxAvatar as Avatar,
  RxExit as Exit,
  RxLockClosed as LockClosed,
  RxPerson as Person,
} from "react-icons/rx";
import { TbGavel } from "react-icons/tb";

import { type Group, type User, type UsersToGroups } from "@echo-webkom/db/schemas";

import { isBedkom, isMemberOf } from "@/lib/memberships";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type UserMenuProps = {
  user: User & {
    memberships: Array<
      UsersToGroups & {
        group: Group;
      }
    >;
  };
};

export const UserMenu = ({ user }: UserMenuProps) => {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button data-testid="user-menu">
          <Avatar className="h-7 w-7" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mx-3 w-56">
        <DropdownMenuLabel>
          <p className="font-medium">Logget inn som</p>
          <p className="font-bold">{user.name}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/auth/profil">
            <Person className="mr-2 h-4 w-4" />
            <span>Min profil</span>
          </Link>
        </DropdownMenuItem>

        {isMemberOf(user, ["webkom", "hovedstyret"]) && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <LockClosed className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}

        {isBedkom(user) && (
          <DropdownMenuItem asChild>
            <Link href="/prikker">
              <TbGavel className="mr-2 h-4 w-4" />
              <span>Prikker</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <button
            className="w-full"
            onClick={() =>
              void signOut({
                callbackUrl: pathname,
              })
            }
          >
            <Exit className="mr-2 h-4 w-4" />
            <span>Logg ut</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
