"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as va from "@vercel/analytics";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { submitForm } from "@/actions/subject-reviews";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { reviewForm } from "@/lib/schemas/review";
import { Textarea } from "./ui/textarea";

export const ReviewForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof reviewForm>>({
    resolver: zodResolver(reviewForm),
    defaultValues: {
      subjectCode: "",
      difficulty: 5,
      usefullness: 5,
      enjoyment: 5,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const resp = await submitForm(data);

    if (resp.success) {
      va.track("");

      form.reset();

      toast({
        title: "Vurdering sendt!",
      });
    }

    if (resp.success) {
      va.track("", {
        message: resp.message,
      });

      toast({
        title: "Noe gikk galt",
        description: resp.message,
        variant: "destructive",
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y4">
        <FormField
          control={form.control}
          name="subjectCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fagkode:</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fagkode:</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="usefullness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fagkode:</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enjoyment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fagkode:</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
