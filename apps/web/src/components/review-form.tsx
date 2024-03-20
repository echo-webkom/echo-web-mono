"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { type z } from "zod";

import { submitForm } from "@/actions/subject-reviews";
import { useToast } from "@/hooks/use-toast";
import { reviewForm } from "@/lib/schemas/review";
import { Button } from "./ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

export function ReviewForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reviewForm>>({
    resolver: zodResolver(reviewForm),
    defaultValues: {
      subjectCode: "",
      userId: "",
      difficulty: 5,
      usefullness: 5,
      enjoyment: 5,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const resp = await submitForm(data);

    if (resp.success) {
      toast({
        title: "Vurdering sendt!",
        variant: "success",
      });

      form.reset();
    }

    if (resp.success) {
      toast({
        title: "Noe gikk galt",
        description: resp.message,
        variant: "destructive",
      });
    }
  });

  return (
    <Form {...form}>
      {/*eslint-disable-next-line @typescript-eslint/no-misused-promises*/}
      <form onSubmit={onSubmit}>
        <div>
          <FormField
            control={form.control}
            name="subjectCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fagkode</FormLabel>
                <FormControl>
                  <Input id="subjectCode" type="text" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fagkode</FormLabel>
                <FormControl>
                  <Input id="subjectCode" type="text" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Submit review</Button>
        </div>
      </form>
    </Form>
  );
}
