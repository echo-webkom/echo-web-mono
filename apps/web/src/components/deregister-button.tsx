"use client";

import React, { useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";

import { deregister } from "@/actions/deregister";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { deregistrationSchema, type DeregistrationForm } from "@/lib/schemas/deregistration";

type DeregisterButtonProps = {
  id: string;
  children: React.ReactNode;
};

export const DeregisterButton = ({ id, children }: DeregisterButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<DeregistrationForm>({
    resolver: standardSchemaResolver(deregistrationSchema),
    defaultValues: {
      hasVerified: false,
      reason: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    const { success, message } = await deregister(id, {
      reason: data.reason,
    });

    setIsLoading(false);

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    form.reset();
    setIsOpen(false);
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
            <>{children}</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Meld deg av</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogDescription className="mb-4">
              Er du sikker på at du vil melde deg av? Oppfyll nødvendig informasjon for å melde deg
              av. Husk at prikken kan medfølge.
            </DialogDescription>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <Label htmlFor="reason">Hvorfor melder du deg av?</Label>
                <Textarea
                  id="reason"
                  {...form.register("reason")}
                  className="w-full"
                  placeholder="Skriv her..."
                />
                <p className="text-sm text-red-500">{form.formState.errors.reason?.message}</p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Controller
                    name="hasVerified"
                    control={form.control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        id="hasVerified"
                        name="hasVerified"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />

                  <Label htmlFor="hasVerified">
                    Jeg er klar over at jeg kan få prikker for dette.
                  </Label>
                </div>
                <p className="text-sm text-red-500">{form.formState.errors.hasVerified?.message}</p>
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="flex flex-col gap-2">
            <Button
              size="sm"
              className="w-full sm:w-auto"
              variant="destructive"
              onClick={() => setIsOpen(false)}
            >
              Avbryt
            </Button>
            <Button size="sm" className="w-full sm:w-auto" type="submit">
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
