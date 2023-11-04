"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { type Degree } from "@echo-webkom/db/schemas";

import { updateSelf } from "@/actions/user";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";

const userSchema = z.object({
  alternativeEmail: z.string().email().or(z.literal("")).optional(),
  degree: z.string().optional(),
  year: z.number().min(1).max(5).optional(),
});

type FormData = z.infer<typeof userSchema>;

type UserFormProps = {
  user: {
    alternativeEmail?: string;
    degree?: Degree;
    year?: number;
    id: string;
  };
  degrees: Array<Degree>;
};

export function UserForm({ user, degrees }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const methods = useForm<FormData>({
    defaultValues: {
      alternativeEmail: user.alternativeEmail,
      degree: user.degree?.id,
      year: user.year,
    },
    resolver: zodResolver(userSchema),
  });

  const onSubmit = methods.handleSubmit(
    async (data) => {
      setIsLoading(true);

      const { success, message } = await updateSelf({
        alternativeEmail: data.alternativeEmail,
        degreeId: data.degree,
        year: data.year,
      });

      setIsLoading(false);

      toast({
        title: message,
        variant: success ? "success" : "warning",
      });

      router.refresh();
    },
    () => {
      toast({
        title: "Noe gikk galt",
        variant: "warning",
      });
    },
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Label htmlFor="alternativeEmail">Alternativ e-post</Label>
        <Input placeholder="Din e-post" type="email" {...methods.register("alternativeEmail")} />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="degree">Studieretning</Label>
        <Controller
          name="degree"
          control={methods.control}
          render={({ field }) => (
            <Select {...field}>
              <option hidden>Velg studieretning</option>
              {degrees.map((degree) => (
                <option key={degree.id} value={degree.id}>
                  {degree.name}
                </option>
              ))}
            </Select>
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="year">Årstrinn</Label>
        <Controller
          name="year"
          control={methods.control}
          render={({ field }) => (
            <Select {...field}>
              <option hidden>Velg årstrinn</option>
              <option value="1">1. trinn</option>
              <option value="2">2. trinn</option>
              <option value="3">3. trinn</option>
              <option value="4">4. trinn</option>
              <option value="5">5. trinn</option>
            </Select>
          )}
        />
      </div>

      <div>
        <Button disabled={!methods.formState.isDirty || isLoading} type="submit">
          {isLoading ? "Lagrer..." : "Lagre"}
        </Button>
      </div>
    </form>
  );
}
