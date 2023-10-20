"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { type Degree } from "@echo-webkom/db/schemas";

import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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

      const response = await fetch(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setIsLoading(false);

      if (!response.ok) {
        return toast({
          title: "Noe gikk galt",
          description: "Kunne ikke oppdatere bruker",
          variant: "warning",
        });
      }

      toast({
        title: "Bruker oppdatert",
        description: "Brukeren din er nå oppdatert",
        variant: "success",
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
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Velg studieretning" />
              </SelectTrigger>
              <SelectContent>
                {degrees.map((degree) => (
                  <SelectItem key={degree.id} value={degree.id}>
                    {degree.name}
                  </SelectItem>
                ))}
              </SelectContent>
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
            <Select
              value={field.value?.toString()}
              onValueChange={(e) => field.onChange(Number(e))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg årstrinn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1. trinn</SelectItem>
                <SelectItem value="2">2. trinn</SelectItem>
                <SelectItem value="3">3. trinn</SelectItem>
                <SelectItem value="4">4. trinn</SelectItem>
                <SelectItem value="5">5. trinn</SelectItem>
              </SelectContent>
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
