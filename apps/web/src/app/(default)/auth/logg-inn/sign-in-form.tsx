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

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const resp = await bat.post("/auth/sign-in", data);

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
    <div className="mx-auto max-w-2xl">
      <Heading className="text-center text-4xl">Velg en måte å logge inn på</Heading>

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={onSubmit} className="space-y-4">
        <fieldset className="space-y-2">
          <Label htmlFor="email">E-post</Label>
          <Input
            type="email"
            autoComplete="email"
            autoCapitalize="false"
            {...form.register("email")}
          />
        </fieldset>
        <fieldset className="space-y-2">
          <Label htmlFor="password">Passord</Label>
          <Input
            type="password"
            autoComplete="current-password"
            autoCapitalize="false"
            {...form.register("password")}
          />
        </fieldset>

        <Button type="submit">Logg inn</Button>
      </form>
    </div>
  );
}
