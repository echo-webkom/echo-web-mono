"use client";

import { useState, type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { removeWhitelist, upsertWhitelist } from "@/actions/whitelist";
import { useToast } from "@/hooks/use-toast";
import { Button, type ButtonProps } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const whitelistFormSchema = z.object({
  email: z.string().email("Ugyldig e-post"),
  days: z.coerce.number().positive("Må være et positivt tall"),
  reason: z.string().min(3, "Må være minst 3 tegn"),
});
type WhitelistForm = z.infer<typeof whitelistFormSchema>;

type Props = {
  whitelistEntry?: {
    email: string;
    reason: string;
  };
} & ButtonProps;

export default function WhitelistButton({
  children,
  whitelistEntry,
  ...buttonProps
}: PropsWithChildren<Props>) {
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WhitelistForm>({
    resolver: zodResolver(whitelistFormSchema),
    defaultValues: {
      email: whitelistEntry?.email ?? "",
      days: 30,
      reason: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { success, message } = await upsertWhitelist(data.email, data.reason, data.days);

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    setIsOpen(false);
    router.refresh();
  });

  const handleDelete = async () => {
    if (!whitelistEntry) {
      toast({
        title: "Denne personen er kanskje ikke i whitelist",
        variant: "warning",
      });
      return;
    }

    const { success, message } = await removeWhitelist(whitelistEntry.email);

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    setIsOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps}>{children ?? "åpne"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Legg til whitelist</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form className="grid gap-4 py-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right">
              e-post
            </label>
            <input
              id="email"
              placeholder="ola.nordmann@student.uib.no"
              className="col-span-3"
              {...register("email")}
              disabled={whitelistEntry !== undefined}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="days" className="text-right">
              Dager
            </label>
            <input
              id="days"
              placeholder="30"
              className="col-span-1"
              type="number"
              {...register("days")}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="reason" className="text-right">
              grunn
            </label>
            <input
              id="reason"
              placeholder={whitelistEntry?.reason ?? "Grunn for whitelisting"}
              className="col-span-3"
              {...register("reason")}
            />
          </div>
          {(errors.email && <span className="text-red-500">1{errors.email.message}</span>) ??
            (errors.days && <span className="text-red-500">2{errors.days.message}</span>) ??
            (errors.reason && <span className="text-red-500">3{errors.reason.message}</span>)}

          <DialogFooter>
            <Button type="submit" className="">
              Lagre
            </Button>
            {whitelistEntry && (
              <Button variant="destructive" onClick={() => void handleDelete()}>
                Slett
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
