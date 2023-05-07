"use client";

import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";

import {Degree} from "@echo-webkom/db/types";
import {degreeToString} from "@echo-webkom/lib";

import {Button} from "./ui/button";
import Input from "./ui/input";
import Label from "./ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";

const userSchema = z.object({
  alternativeEmail: z.string().email().or(z.literal("")).optional(),
  degree: z.nativeEnum(Degree).optional(),
  year: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .transform((value) => (value ? Number(value) : undefined)),
});

type FormData = z.infer<typeof userSchema>;

export default function UserForm({
  alternativeEmail,
  degree,
  year,
  id,
}: {
  alternativeEmail?: string;
  degree?: Degree;
  year?: number;
  id: string;
}) {
  const methods = useForm<FormData>({
    defaultValues: {
      alternativeEmail: alternativeEmail,
      degree: degree,
      year: year,
    },
    resolver: zodResolver(userSchema),
  });

  const router = useRouter();

  const onSubmit = methods.handleSubmit(
    async (data) => {
      const response = await fetch(`/api/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert("Noe gikk galt.");
      }

      alert("Bruker oppdatert");

      router.refresh();
    },
    (error) => {
      console.error(error);
    },
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Label htmlFor="alternativeEmail">Alternativ e-post</Label>
        <Input type="email" {...methods.register("alternativeEmail")} />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="degree">Studieretning</Label>
        <Controller
          name="degree"
          control={methods.control}
          render={({field}) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Velg studieretning" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(Degree).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {degreeToString[value]}
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
          render={({field}) => (
            <Select
              value={field.value?.toString()}
              onValueChange={(e) => field.onChange(parseInt(e))}
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
        <Button type="submit">Lagre</Button>
      </div>
    </form>
  );
}
