"use client";

import { DialogClose } from "@radix-ui/react-dialog";

import { type Group } from "@echo-webkom/db/schemas";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type MembersModalProps = {
  group: Group;
  users: Array<{ id: string; name: string }>;
};

export function MembersModal({ group, users }: MembersModalProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="pr-10">
          Endre rolle
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Detaljer for {group.name}</DialogTitle>
        </DialogHeader>

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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Lukk</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
