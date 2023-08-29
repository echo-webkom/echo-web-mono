"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDeregistration } from "@/hooks/use-deregistration";
import { useToast } from "@/hooks/use-toast";
import { deregistrationSchema, type DeregistrationForm } from "@/lib/schemas/deregistration";

export const DeregisterButton = ({ slug }: { slug: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { deregister, isLoading } = useDeregistration(slug, {
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
      toast({
        title: "Avmelding fullført",
        description: "Du er nå avmeldt arrangementet",
      });
    },
    onError: () => {
      setIsOpen(false);
      toast({
        title: "Noe gikk galt",
        description: "Kunne ikke melde deg av arrangementet",
      });
    },
  });

  const methods = useForm<DeregistrationForm>({
    resolver: zodResolver(deregistrationSchema),
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    await deregister({
      reason: data.reason,
    });
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant="secondary" fullWidth>
          {isLoading ? (
            <>
              <span>
                <AiOutlineLoading className="h-4 w-4 animate-spin" />
              </span>
              <span className="ml-2">Melder av...</span>
            </>
          ) : (
            <span>Meld av</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Meld deg av</DialogTitle>
          <DialogDescription>
            Er du sikker på at du vil melde deg av? Oppfyll nødvendig informasjon for å melde deg
            av. Husk at prikken kan medfølge.
          </DialogDescription>
        </DialogHeader>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <Label htmlFor="reason">Hvorfor melder du deg av?</Label>
              <Textarea
                id="reason"
                {...methods.register("reason")}
                className="w-full"
                placeholder="Skriv her..."
              />
              <p className="text-sm text-red-500">{methods.formState.errors.reason?.message}</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Controller
                  name="hasVerified"
                  control={methods.control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      id="hasVerified"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />

                <Label htmlFor="hasVerified">
                  Jeg er klar over at jeg kan få prikker for dette.
                </Label>
              </div>
              <p className="text-sm text-red-500">
                {methods.formState.errors.hasVerified?.message}
              </p>
            </div>
          </div>

          <DialogFooter className="mt-5 flex flex-col gap-2">
            <Button
              className="w-full sm:w-auto"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Avbryt
            </Button>
            <Button className="w-full sm:w-auto" type="submit">
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
