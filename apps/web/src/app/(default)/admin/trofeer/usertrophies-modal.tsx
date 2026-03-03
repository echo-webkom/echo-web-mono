"use client";

import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { CheckIcon } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type AllUsers } from "../brukere/page";

export const UserTrophiesModal = ({ users }: { users: AllUsers }) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Dialog>
      <DialogTrigger className="hover:bg-muted rounded-lg border-2 px-2 py-1">
        Rediger personer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Personer</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="mb-4 flex flex-col gap-2">
            <Label>Søk:</Label>
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Søk..."
            />
          </div>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id}>
                <LineForGivingTrophyToUser user={user} />
              </div>
            ))}
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

type User = AllUsers[number];

const LineForGivingTrophyToUser = ({ user }: { user: User }) => {
  return (
    <div key={user.id} className="flex justify-between">
      <p>{user.name}</p>
      <GiveTrophyButton hasTrophy={false} />
    </div>
  );
};

const GiveTrophyButton = ({ hasTrophy }: { hasTrophy: boolean }) => {
  return (
    <div
      className={`${hasTrophy ? "bg-green-500" : "bg-primary"} px-auto flex w-fit justify-center rounded-md px-4 py-1`}
    >
      {hasTrophy ? <CheckIcon /> : <p>Gi</p>}
    </div>
  );
};
