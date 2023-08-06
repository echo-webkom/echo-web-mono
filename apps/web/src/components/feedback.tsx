"use client";

import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {MdOutlineFeedback} from "react-icons/md";

import {useToast} from "@/hooks/use-toast";
import {feedbackSchema, type FeedbackForm} from "@/lib/schemas/feedback";
import {Button} from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {Textarea} from "./ui/textarea";

export const Feedback = () => {
  const {toast} = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = methods.handleSubmit(
    async (data) => {
      const response = await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          title: "Tilbakemelding sendt",
          description: "Takk for din tilbakemelding!",
          variant: "success",
        });
      } else {
        toast({
          title: "Noe gikk galt",
          description: "Kunne ikke sende tilbakemelding",
          variant: "warning",
        });
      }

      setIsOpen(false);
      methods.reset();
    },
    (error) => {
      console.error(error);
    },
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-0 right-0 z-30 m-5 h-12 w-12 rounded-full bg-primary shadow-md focus:ring focus:ring-primary focus:ring-offset-2"
        >
          <MdOutlineFeedback className="mx-auto mt-auto h-6 w-6 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send inn tilbakemelding</DialogTitle>
          <DialogDescription>
            Din tilbakemelding betyr mye for oss. Gjerne fortell oss hva du ønsker å se på nettsiden
            eller hva vi kan gjøre bedre. Alternativt kan du også opprette en issue på GitHub for å
            rapportere en feil.
          </DialogDescription>
        </DialogHeader>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={onSubmit} onReset={() => methods.reset()}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                {...methods.register("email")}
                id="email"
                name="email"
                type="email"
                placeholder="Din e-post"
              />
              {methods.formState.errors.email?.message && (
                <p className="text-xs italic text-red-500">
                  {methods.formState.errors.email?.message.toString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Navn</Label>
              <Input
                {...methods.register("name")}
                id="name"
                name="name"
                type="text"
                placeholder="Ditt navn"
              />
              {methods.formState.errors.name?.message && (
                <p className="text-xs italic text-red-500">
                  {methods.formState.errors.name?.message.toString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Tilbakemelding</Label>
              <Textarea
                {...methods.register("message")}
                id="message"
                name="message"
                placeholder="Din tilbakemelding"
              />
              {methods.formState.errors.message?.message && (
                <p className="text-xs italic text-red-500">
                  {methods.formState.errors.message?.message.toString()}
                </p>
              )}
            </div>
          </div>
          <small>
            Feltene for navn og e-post er ikke påkrevd, men fylles ut dersom du tillater at vi
            kontakter deg om tilbakemeldingen.
          </small>
          <DialogFooter className="mt-3 flex flex-col gap-2">
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
