"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { sendFeedback } from "@/actions/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { feedbackSchema, type FeedbackForm } from "@/lib/schemas/feedback";

export function FeedbackForm() {
  const { toast } = useToast();

  const methods = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      email: "",
      message: "",
      name: "",
    },
  });

  const onSubmit = methods.handleSubmit(
    async (data) => {
      const { success, message } = await sendFeedback(data);

      toast({
        title: message,
        variant: success ? "success" : "destructive",
      });

      methods.reset();
    },
    (error) => {
      console.error(error);
    },
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={onSubmit} className="space-y-4">
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
          <Label htmlFor="message" required>
            Tilbakemelding
          </Label>
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

      <div>
        <small>
          Feltene for navn og e-post er ikke påkrevd, men fylles ut dersom du tillater at vi
          kontakter deg om tilbakemeldingen.
        </small>
      </div>

      <div>
        <Button className="w-full sm:w-auto" type="submit">
          Send
        </Button>
      </div>
    </form>
  );
}
