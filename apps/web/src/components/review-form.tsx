"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as va from "@vercel/analytics";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { submitForm } from "@/actions/subject-reviews";
import { useToast } from "@/hooks/use-toast";
import { reviewForm } from "@/lib/schemas/review";

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
  function onSubmit() {
    form.handleSubmit(async (data) => {
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
          // message: resp.message,
        });

        toast({
          title: "Noe gikk galt",
          description: resp.message,
          variant: "destructive",
        });
      }
    });
  }
  // const onSubmitc = form.handleSubmit(async (data) => {
  //   const resp = await submitForm(data);

  //   if (resp.result === "success") {
  //     va.track("");

  //     form.reset();

  //     toast({
  //       title: "Vurdering sendt!",
  //     });
  //   }

  //   if (resp.result === "error") {
  //     va.track("", {
  //       message: resp.message,
  //     });

  //     toast({
  //       title: "Noe gikk galt",
  //       description: resp.message,
  //       variant: "destructive",
  //     });
  //   }
  // });

  return <div>hei</div>;
};
