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
import { cn } from "@/utils/cn";
import { DropdownMenuItem } from "./ui/dropdown-menu";

type EditRegistrationFormProps = {
  id: string;
  registration: RegistrationWithUser;
};

export function EditRegistrationForm({ id, registration }: EditRegistrationFormProps) {
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

    const response = await updateRegistration({
      happeningId: id,
      registrationUserId: registration.user.id,
      registration: {
        status: selectedStatus,
        reason: data.reason ?? "",
      },
    });

    setIsLoading(false);

    if (response.success) {
      toast({
        title: "Påmeldingen er endret",
        description: response.data,
        variant: "success",
      });
    } else {
      toast({
        title: "Påmeldingen er ikke endret",
        description: response.message,
        variant: "destructive",
      });
    }

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
          setIsOpen(false);
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          className="pr-10"
        >
          Endre
        </DropdownMenuItem>
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
              <Button
                variant={selectedStatus === "registered" ? "secondary" : "outline"}
                className={cn("text-xs", {
                  "border border-black": selectedStatus === "registered",
                })}
                onClick={() => handleStatusChange("registered")}
              >
                Påmeldt
              </Button>
              <Button
                variant={selectedStatus === "waiting" ? "secondary" : "outline"}
                className={cn("text-xs", {
                  "border border-black": selectedStatus === "waiting",
                })}
                onClick={() => handleStatusChange("waiting")}
              >
                Venteliste
              </Button>
              <Button
                variant={selectedStatus === "unregistered" ? "secondary" : "outline"}
                className={cn("text-xs", {
                  "border border-black": selectedStatus === "unregistered",
                })}
                onClick={() => handleStatusChange("unregistered")}
              >
                Avmeldt
              </Button>
              <Button
                variant={selectedStatus === "removed" ? "secondary" : "outline"}
                className={cn("text-xs", {
                  "border border-black": selectedStatus === "removed",
                })}
                onClick={() => handleStatusChange("removed")}
              >
                Fjernet
              </Button>
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
