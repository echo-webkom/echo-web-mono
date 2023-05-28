"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {AiOutlineLoading} from "react-icons/ai";
import {type z} from "zod";

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
import Textarea from "@/components/ui/textarea";
import {useDeregistration} from "@/hooks/use-deregistration";
import {useToast} from "@/hooks/use-toast";
import {deregistrationSchema} from "@/lib/schemas/deregistration";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

export default function DeregisterButton({slug}: {slug: string}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const {toast} = useToast();
  const {deregister, isLoading} = useDeregistration(slug, {
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

  const methods = useForm<z.infer<typeof deregistrationSchema>>({
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
        <Form {...methods}>
          <form onSubmit={onSubmit}>
            <FormField
              name="reason"
              control={methods.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="reason">Hvorfor melder du deg av?</FormLabel>
                  <FormControl>
                    <Textarea
                      id="reason"
                      {...field}
                      className="w-full"
                      placeholder="Skriv her..."
                    />
                  </FormControl>
                  <FormDescription>
                    Skriv en kort forklaring på hvorfor du melder deg av. Dette er for å gi
                    arrangøren en forståelse av hvorfor du melder deg av.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="hasVerified"
              control={methods.control}
              render={({field}) => (
                <FormItem className="my-3">
                  <div className="flex items-center gap-x-3">
                    <FormControl>
                      <Checkbox
                        id="hasVerified"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel htmlFor="hasVerified">
                      Jeg er klar over at jeg kan få prikker for dette.
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
