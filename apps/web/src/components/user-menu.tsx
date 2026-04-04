"use client";

import { type Group, type User, type UsersToGroups } from "@echo-webkom/db/schemas";
import { CircleUser, Gavel, Lock, LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useSignOut } from "@/auth/client";
import { isBedkom, isMemberOf } from "@/lib/memberships";

import { createProfilePictureUrl } from "../api/client";
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
  const { signOut } = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button data-testid="user-menu">
          {user.image ? (
            <Image
              src={createProfilePictureUrl(user.id) ?? ""}
              alt="User image"
              className="h-7 w-7 rounded-full"
              width={64}
              height={64}
              unoptimized
            />
          ) : (
            <CircleUser className="h-7 w-7" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mx-3 w-56">
        <DropdownMenuLabel>
          <p className="font-medium">Logget inn som</p>
          <p className="font-bold">{user.name}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/auth/user/${user.id}`}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Min profil</span>
          </Link>
        </DropdownMenuItem>

        {isMemberOf(user, ["webkom", "hovedstyret"]) && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Lock className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}

        {isBedkom(user) && (
          <DropdownMenuItem asChild>
            <Link href="/prikker">
              <Gavel className="mr-2 h-4 w-4" />
              <span>Prikker</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <button onClick={() => void signOut()} className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logg ut</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
