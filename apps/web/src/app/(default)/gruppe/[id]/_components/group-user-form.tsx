"use client";

import { useRouter } from "next/navigation";
import { LuTrash as Trash } from "react-icons/lu";
import { TbUserEdit } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { removeFromGroup, setGroupLeader } from "../actions";

type GroupUserFormProps = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  group: {
    id: string;
    name: string;
  };
  isLeader: boolean;
};

export function GroupUserForm({ user, group, isLeader }: GroupUserFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleSetIsLeader = async (checked: boolean) => {
    const { message } = await setGroupLeader(group.id, user.id, checked);

    toast({
      title: message,
    });

    router.refresh();
  };

  const handleRemoveUser = async () => {
    const { success, message } = await removeFromGroup(user.id, group.id);

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    if (!success) {
      return;
    }

    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <TbUserEdit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Administrer {user.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="mb-2">
            <Label>Navn</Label>
            <p className="text-sm text-slate-500">{user.name}</p>
          </div>
          <div className="mb-2">
            <Label>E-post</Label>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label>Leder</Label>
            <p className="text-sm text-muted-foreground">
              Skal brukeren kunne fjerne og legge til brukere i gruppen?
            </p>
          </div>
          <div className="px-4">
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <Switch checked={isLeader} onCheckedChange={handleSetIsLeader} />
          </div>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label>Fjern fra gruppe</Label>
          </div>
          <div className="px-4">
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <Button onClick={handleRemoveUser} variant="destructive" size="icon">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button>Lukk</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
