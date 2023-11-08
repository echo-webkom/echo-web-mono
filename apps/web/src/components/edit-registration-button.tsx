"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";

import { type RegistrationStatus } from "@echo-webkom/db/schemas";

import { updateRegistration } from "@/actions/update-registration";
import { type RegistrationWithUser } from "@/components/registration-table";
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
import { useToast } from "@/hooks/use-toast";
import { editRegistrationSchema, type editRegistrationForm } from "@/lib/schemas/editregistration";

type EditRegistrationButtonProps = {
  slug: string;
  registration: RegistrationWithUser;
};

export function EditRegistrationButton({ slug, registration }: EditRegistrationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<editRegistrationForm>({
    resolver: zodResolver(editRegistrationSchema),
    defaultValues: {
      status: registration.status,
      reason: "",
      hasVerified: false,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    await updateRegistration(slug, registration.user.id, {
      status: selectedStatus,
      reason: data.reason ?? "",
    });

    setIsLoading(false);

    toast({
      title: "Påmeldingen er endret",
      description: "Påmeldingen er endret.",
      variant: "success",
    });

    router.refresh();
    form.reset();
    setIsOpen(false);
  });

  const [selectedStatus, setSelectedStatus] = useState(registration.status);

  const handleStatusChange = (status: RegistrationStatus) => {
    setSelectedStatus(status);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(newIsOpen) => {
        if (!newIsOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant="secondary" fullWidth>
          Endre
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Endre registrering</DialogTitle>
          <DialogDescription>
            Her kan du gjøre endring på den valgte registreringen. Skriv i tekstboksen hvorfor du
            gjør endringen og hvem du er.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit();
          }}
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label className="text-bold">Navn:</Label>
                <Label>{registration.user.name}</Label>
              </div>
              <div className="flex flex-col gap-2">
                <Label>E-Post:</Label>
                <Label>{registration.user.alternativeEmail ?? registration.user.email}</Label>
              </div>
            </div>
            <div className="flex flex-col gap-5"></div>
            <div className="flex flex-row gap-10">
              <Label>Status:</Label>
              <Label></Label>
            </div>
            <div className="grid w-full grid-cols-4 gap-1">
              <button
                className={`rounded-lg border px-2 py-4 text-center text-xs
                ${
                  selectedStatus === "registered"
                    ? "border border-black bg-primary font-bold text-white"
                    : "hover:bg-secondary"
                }
                  `}
                onClick={() => handleStatusChange("registered")}
              >
                Påmeldt
              </button>
              <button
                className={`rounded-lg border px-2 py-4 text-center text-xs
                  ${
                    selectedStatus === "waiting"
                      ? "border border-black bg-primary font-bold text-white"
                      : "hover:bg-secondary"
                  }
                  `}
                onClick={() => handleStatusChange("waiting")}
              >
                Venteliste
              </button>
              <button
                className={`rounded-lg border px-2 py-4 text-center text-xs
                  ${
                    selectedStatus === "unregistered"
                      ? "border border-black bg-primary font-bold text-white"
                      : "hover:bg-secondary"
                  }
                `}
                onClick={() => handleStatusChange("unregistered")}
              >
                Avmeldt
              </button>
              <button
                className={`rounded-lg border px-2 py-4 text-center text-xs
                  ${
                    selectedStatus === "removed"
                      ? "border border-black bg-primary font-bold text-white"
                      : "hover:bg-secondary"
                  }
                `}
                onClick={() => handleStatusChange("removed")}
              >
                Fjernet
              </button>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <Label htmlFor="reason">Hvorfor gjør du endring?</Label>
                <Controller
                  name="reason"
                  control={form.control}
                  defaultValue=""
                  render={({ field }) => (
                    <Textarea
                      id="reason"
                      {...form.register("reason")}
                      className="w-full"
                      placeholder="Skriv her..."
                      onChange={field.onChange}
                    />
                  )}
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
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />

                  <Label htmlFor="hasVerified">Jeg bekrefter endringen.</Label>
                </div>
                <p className="text-sm text-red-500">{form.formState.errors.hasVerified?.message}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-5 flex flex-col gap-2">
            <Button
              className="w-full sm:w-auto"
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
                form.reset();
              }}
            >
              Avbryt
            </Button>
            <Button className="w-full sm:w-auto" type="submit">
              {isLoading ? (
                <>
                  <span>
                    <AiOutlineLoading className="h-4 w-4 animate-spin" />
                  </span>
                  <span className="ml-2">Endrer...</span>
                </>
              ) : (
                <span>Send</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
