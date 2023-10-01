"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { degreeToString } from "@echo-webkom/lib";
import { degreeEnum, yearEnum, type Degree, type Year } from "@echo-webkom/storage/client";

import { useToast } from "@/hooks/use-toast";
import { bat } from "@/lib/bat";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const userSchema = z.object({
  degree: z.enum(degreeEnum.enumValues).optional(),
  year: z.enum(yearEnum.enumValues).optional(),
});

type FormData = z.infer<typeof userSchema>;

export function UserForm({ degree, year }: { degree: Degree | null; year: Year | null }) {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const methods = useForm<FormData>({
    defaultValues: {
      degree: degree ?? undefined,
      year: year ?? undefined,
    },
    resolver: zodResolver(userSchema),
  });

  const onSubmit = methods.handleSubmit(
    async (data) => {
      setIsLoading(true);

      const response = await bat.patch("/me", data);

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
                {Object.values(degreeEnum.enumValues).map((degree) => (
                  <SelectItem key={degree} value={degree}>
                    {degreeToString[degree]}
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
                <SelectItem value={yearEnum.enumValues["0"]}>1. trinn</SelectItem>
                <SelectItem value={yearEnum.enumValues["1"]}>2. trinn</SelectItem>
                <SelectItem value={yearEnum.enumValues["2"]}>3. trinn</SelectItem>
                <SelectItem value={yearEnum.enumValues["3"]}>4. trinn</SelectItem>
                <SelectItem value={yearEnum.enumValues["4"]}>5. trinn</SelectItem>
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
