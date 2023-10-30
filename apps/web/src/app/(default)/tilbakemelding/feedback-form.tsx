"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { sendFeedback } from "@/actions/feedback";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { feedbackSchema, type FeedbackForm } from "@/lib/schemas/feedback";

export function FeedbackForm() {
  const { toast } = useToast();

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      email: "",
      name: "",
      category: undefined,
      message: "",
    },
  });

  const onSubmit = form.handleSubmit(
    async (data) => {
      const { success, message } = await sendFeedback(data);

      toast({
        title: message,
        variant: success ? "success" : "destructive",
      });

      form.reset();
    },
    (error) => {
      console.error(error);
    },
  );

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-post</FormLabel>
                <FormControl>
                  <Input id="email" placeholder="Din e-post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Navn</FormLabel>
                <FormControl>
                  <Input id="name" placeholder="Ditt navn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Kategori</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg en kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Funksjonalitet</SelectItem>
                    <SelectItem value="login">Innlogging</SelectItem>
                    <SelectItem value="other">Annet</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Tilbakemelding</FormLabel>
                <FormControl>
                  <Textarea id="message" placeholder="Din tilbakemelding" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
    </Form>
  );
}
