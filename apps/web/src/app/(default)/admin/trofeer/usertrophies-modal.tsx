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

export const UserTrophiesModal = () => {
  const users = [
    { id: 1, name: "j" },
    { id: 2, name: "o" },
  ];
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          className="border-none bg-gray-300 text-black hover:cursor-pointer hover:bg-gray-400"
          size="sm"
        >
          Rediger personer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Personer</DialogTitle>
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
