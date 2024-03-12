"use client";

import * as va from "@vercel/analytics";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { submitApplication } from "./actions";

import { reviewForm } from "@/lib/schemas/review";
import { useToast } from "@/hooks/use-toast";
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
    }
  })

  const resp = await submitForm();

  if (resp.result === "success") {
    va.track("");

    form.reset();

    toast({
      title: "Søknad sendt!",
      description: "Vi vil kontakte deg om intervju.",
    });
  }

  if (resp.result === "error") {
    va.track("", {
      message: resp.message,
    });

    toast({
      title: "Noe gikk galt",
      description: resp.message,
      variant: "destructive",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={onsubmit} className="space-y4">
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
