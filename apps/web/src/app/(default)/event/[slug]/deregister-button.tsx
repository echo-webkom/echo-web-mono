"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {AiOutlineLoading} from "react-icons/ai";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Label from "@/components/ui/label";
import Textarea from "@/components/ui/textarea";
import {useToast} from "@/hooks/use-toast";
import {deregistrationSchema, type DeregistrationForm} from "@/lib/schemas/deregistration";

const responseDataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export default function DeregisterButton({slug}: {slug: string}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  const methods = useForm<DeregistrationForm>({
    resolver: zodResolver(deregistrationSchema),
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    const response = await fetch(`/api/happening/${slug}/deregister`, {
      method: "POST",
      body: JSON.stringify({
        reason: data.reason,
      }),
    });

    const parsedData = responseDataSchema.safeParse(await response.json());
    if (!parsedData.success) {
      return toast({
        title: "Noe gikk galt",
        variant: "destructive",
      });
    }

    const {title, description} = parsedData.data;

    toast({
      title,
      description,
      variant: response.status < 400 ? "success" : "warning",
    });

    router.refresh();
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant="secondary" fullWidth>
          {methods.formState.isLoading ? (
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
                  render={({field}) => (
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
}
