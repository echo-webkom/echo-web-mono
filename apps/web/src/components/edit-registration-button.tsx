"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { useEditregistration } from "@/hooks/use-editregistration";
import { useToast } from "@/hooks/use-toast";
import { editRegistrationSchema, type editRegistrationForm } from "@/lib/schemas/editregistration";

type EditRegistrationButtonProps = {
  slug: string;
  registration: any;
};

export function EditRegistrationButton({ slug, registration }: EditRegistrationButtonProps) {
  const initialFormValues = {
    status: registration.status,
    changelog: '', // Add more initial values as needed
    hasVerified: false, // Add more initial values as needed
  };
  const [formValues, setFormValues] = useState(initialFormValues)
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { editRegistration, isLoading } = useEditregistration(slug, registration.userId, {
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
      toast({
        title: "Endring fullført",
        description: "Du har nå endret registreringen",
      });
      setFormValues(initialFormValues);
    },
    onError: () => {
      setIsOpen(false);
      toast({
        title: "Noe gikk galt",
        description: "Kunne ikke endre registreringen",
      });
    },
  });

  const resetState = () => {
    setFormValues(initialFormValues);
    setSelectedStatus(registration.status);
    setIsOpen(false);
  };

  const methods = useForm<editRegistrationForm>({
    resolver: zodResolver(editRegistrationSchema),
  });

  const [selectedStatus, setSelectedStatus] = useState(registration.status);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const onSubmit = methods.handleSubmit(async (data) => {
    await editRegistration({
      status: selectedStatus,
    });
    resetState();
    setIsOpen(false);
    router.refresh();
  });

  return (
    <Dialog open={isOpen} onOpenChange={(setIsOpen) => {
      if (!open) {
        resetState();
      }
    }}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant="secondary" fullWidth>
          {isLoading ? (
            <>
              <span>
                <AiOutlineLoading className="h-4 w-4 animate-spin" />
              </span>
              <span className="ml-2">Endrer...</span>
            </>
          ) : (
            <span>Endre</span>
          )}
          </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Endre registrering</DialogTitle>
          <DialogDescription>
            Her kan du gjøre endring på den valgte registreringen. Skriv i tekstboksen hvorfor du gjør endringen og hvem du er.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label className="text-bold">Navn:</Label>
                <Label>{registration.user.name}</Label>
              </div>
              <div className="flex flex-col gap-2">
                <Label>E-Post:</Label>
                <Label>{registration.user.alternativeEmail == null ? registration.user.email : registration.user.alternativeEmail}</Label>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Studie:</Label>
                <Label>{registration.user.degree}</Label>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Verv:</Label>
                {/* <Label>{registration.user.studentGroups.map((group) => groupToString[group]).join(", ")}</Label> */}
              </div>
              <div className="flex flex-row gap-10">
                <Label>Status:</Label>
                <Label></Label>
              </div>
              <div className="grid grid-cols-3 w-full md:w-1/2 gap-1">
                <div
                  className={`border px-2 py-4 text-center text-xs rounded-lg
                  ${selectedStatus === 'REGISTERED' ? 'bg-primary font-bold text-white border border-black' : 'hover:bg-secondary'}
                  `}
                  onClick={() => handleStatusChange('REGISTERED')}
                >
                  <p>Påmeldt</p>
                </div>
                <div
                  className={`border px-2 py-4 text-center text-xs rounded-lg
                  ${selectedStatus === 'WAITLISTED' ? 'bg-primary font-bold text-white border border-black' : 'hover:bg-secondary'}
                  `}
                  onClick={() => handleStatusChange('WAITLISTED')}
                >
                  <p>Venteliste</p>
                </div>
                <div className={`border px-2 py-4 text-center text-xs rounded-lg
                  ${selectedStatus === 'DEREGISTERED' ? 'bg-primary font-bold text-white border border-black' : 'hover:bg-secondary'}
                `}
                  onClick={() => handleStatusChange('DEREGISTERED')}
                >
                  <p>Avmeldt</p>
                </div>
              </div>
              <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <Label htmlFor="changelog">Hvorfor gjør du endring?</Label>
              <Textarea
                id="changelog"
                {...methods.register("status")}
                className="w-full"
                placeholder="Skriv her..."
              />
              <p className="text-sm text-red-500">{methods.formState.errors.status?.message}</p>
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
                  Jeg bekrefter endringen.
                </Label>
              </div>
              <p className="text-sm text-red-500">
                {methods.formState.errors.hasVerified?.message}
              </p>
            </div>
          </div>
            </div>

          </div>
          <DialogFooter className="mt-5 flex flex-col gap-2">
            <Button
              className="w-full sm:w-auto"
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
                resetState();
              }}
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
}
