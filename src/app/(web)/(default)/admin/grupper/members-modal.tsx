"use client";

import { DialogClose } from "@radix-ui/react-dialog";

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
import { Group } from "@/db/schemas";

type MembersModalProps = {
  group: Group;
  users: Array<{ id: string; name: string }>;
};

export const MembersModal = ({ group, users }: MembersModalProps) => {
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
            {users.length === 0 ? (
              <p className="text-center text-xl">Ingen medlemmer</p>
            ) : (
              <ul>
                {users.map((user) => (
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
