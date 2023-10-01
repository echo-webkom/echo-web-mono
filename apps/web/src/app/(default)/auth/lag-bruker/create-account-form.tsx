"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { bat } from "@/lib/bat";
import { Button } from "../../../../components/ui/button";
import { Heading } from "../../../../components/ui/heading";

const createAccountFormSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passordene må være like",
        path: ["confirmPassword"],
      });
    }
  });

export function CreateAccountForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createAccountFormSchema>>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const resp = await bat.post("/auth/sign-up", data);

    if (resp.ok) {
      toast({
        title: "Du er nå logget inn!",
        variant: "success",
      });
      form.reset();
      router.refresh();
    } else {
      toast({
        title: "Noe gikk galt",
        variant: "warning",
      });
    }
  });

  return (
    <div>
      <Heading className="text-center text-4xl">Lag en bruker</Heading>

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={onSubmit} className="space-y-4">
        <fieldset className="space-y-2">
          <Label htmlFor="email">E-post</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            autoCapitalize="false"
            {...form.register("email")}
          />
        </fieldset>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <fieldset className="space-y-2">
            <Label htmlFor="firstName">Fornavn</Label>
            <Input
              id="firstName"
              type="text"
              autoComplete="first-name"
              autoCapitalize="false"
              {...form.register("firstName")}
            />
          </fieldset>

          <fieldset className="space-y-2">
            <Label htmlFor="lastName">Etternavn</Label>
            <Input
              id="lastName"
              type="text"
              autoComplete="last-name"
              autoCapitalize="false"
              {...form.register("lastName")}
            />
          </fieldset>
        </div>

        <fieldset className="space-y-2">
          <Label htmlFor="password">Passord</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            autoCapitalize="false"
            {...form.register("password")}
          />
        </fieldset>

        <fieldset className="space-y-2">
          <Label htmlFor="confirmPassword">Bekreft passord</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            autoCapitalize="false"
            {...form.register("confirmPassword")}
          />
        </fieldset>

        <Button type="submit">Lag bruker</Button>
      </form>
    </div>
  );
}
