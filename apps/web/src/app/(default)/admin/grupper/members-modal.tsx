"use client";

import { type Group } from "@echo-webkom/db/schemas";
import { DialogClose } from "@radix-ui/react-dialog";
import { use } from "react";

import { type UnoClientType } from "@/api/uno/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type MembersModalProps = {
  group: Group;
  membersPromise: ReturnType<UnoClientType["groups"]["members"]>;
};

export const MembersModal = ({ group, membersPromise }: MembersModalProps) => {
  const members = use(membersPromise);

  return (
    <Dialog>
      <DialogTrigger>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="pr-10">
          Se detaljer
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Detaljer for {group.name}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div>
            {members.length === 0 ? (
              <p className="text-center text-xl">Ingen medlemmer</p>
            ) : (
              <ul>
                {members.map((user) => (
                  <li key={user.id}>{user.name}</li>
                ))}
              </ul>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm" variant="ghost">
              Lukk
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
