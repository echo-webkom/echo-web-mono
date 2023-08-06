"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";

import {Degree} from "@echo-webkom/db/enums";
import {degreeToString} from "@echo-webkom/lib";

import {useToast} from "@/hooks/use-toast";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
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

export const UserForm = ({
  alternativeEmail,
  degree,
  year,
  id,
}: {
  alternativeEmail?: string;
  degree?: Degree;
  year?: number;
  id: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {toast} = useToast();
  const router = useRouter();
  const methods = useForm<FormData>({
    defaultValues: {
      alternativeEmail: alternativeEmail,
      degree: degree,
      year: year,
    },
    resolver: zodResolver(userSchema),
  });

  const onSubmit = methods.handleSubmit(
    async (data) => {
      setIsLoading(true);

      const response = await fetch(`/api/user/${id}`, {
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
};
