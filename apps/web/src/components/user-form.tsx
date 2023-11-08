"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type Degree } from "@echo-webkom/db/schemas";

import { updateSelf } from "@/actions/user";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

const userSchema = z.object({
  alternativeEmail: z.string().email().or(z.literal("")).optional(),
  degree: z.string().optional(),
  year: z.coerce.number().min(1).max(5).optional(),
});

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
  const form = useForm<z.infer<typeof userSchema>>({
    defaultValues: {
      alternativeEmail: user.alternativeEmail,
      degree: user.degree?.id,
      year: user.year,
    },
    resolver: zodResolver(userSchema),
  });

  const onSubmit = form.handleSubmit(
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
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="alternativeEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="alternativeEmail">Alternativ e-post</FormLabel>
              <FormControl>
                <Input id="alternativeEmail" placeholder="Din e-post" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="degree"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="degree">Studieretning</FormLabel>
              <FormControl>
                <Select id="degree" {...field}>
                  <option hidden>Velg studieretning</option>
                  {degrees.map((degree) => (
                    <option key={degree.id} value={degree.id}>
                      {degree.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="year">Årstrinn</FormLabel>
              <FormControl>
                <Select id="year" {...field}>
                  <option hidden>Velg årstrinn</option>
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((year) => (
                    <option key={year} value={year}>
                      {year}. trinn
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button type="submit">{isLoading ? "Lagrer..." : "Lagre"}</Button>
        </div>
      </form>
    </Form>
  );
}
