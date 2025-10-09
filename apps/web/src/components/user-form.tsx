"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type Degree } from "@echo-webkom/db/schemas";

import { updateSelf } from "@/actions/user";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

const userSchema = z.object({
  alternativeEmail: z.string().email().or(z.literal("")).optional(),
  degree: z.string().optional(),
  year: z.coerce.number().min(1).max(6).optional(),
  hasReadTerms: z.boolean().optional(),
  birthday: z.coerce.date().optional(),
  isPublic: z.boolean().optional(),
});

type UserFormProps = {
  user: {
    alternativeEmail?: string;
    alternativeEmailVerifiedAt?: Date | null;
    degree?: Degree;
    year?: number;
    hasReadTerms?: boolean;
    id: string;
    birthday?: Date;
    isPublic?: boolean;
  };
  degrees: Array<Degree>;
};

export const UserForm = ({ user, degrees }: UserFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof userSchema>>({
    defaultValues: {
      alternativeEmail: user.alternativeEmail,
      degree: user.degree?.id,
      year: user.year,
      hasReadTerms: user.hasReadTerms,
      birthday: user.birthday,
      isPublic: user.isPublic,
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
        hasReadTerms: data.hasReadTerms,
        birthday: data.birthday,
        isPublic: data.isPublic,
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

  const isAlternativeEmailVerified = user.alternativeEmail && !!user.alternativeEmailVerifiedAt;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="alternativeEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="alternativeEmail">
                Alternativ e-post
                {user.alternativeEmail && isAlternativeEmailVerified ? (
                  <span className="text-green-500"> (Bekreftet)</span>
                ) : user.alternativeEmail ? (
                  <span className="text-red-500"> (Ubekreftet)</span>
                ) : null}
              </FormLabel>
              <FormControl>
                <Input id="alternativeEmail" placeholder="Din e-post" {...field} />
              </FormControl>
              <FormDescription>
                Om du ønsker å få e-post tilsendt en annen mail.
                {user.alternativeEmail && !user.alternativeEmailVerifiedAt && (
                  <>
                    <br />
                    Du må bekrefte denne e-posten for å kunne logge inn med den.
                  </>
                )}
              </FormDescription>
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
                  {Array.from({ length: 6 }, (_, i) => i + 1).map((year) => (
                    <option key={year} value={year}>
                      {year === 6 ? "5+." : year + "."} trinn
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
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bursdag</FormLabel>
              <FormControl>
                <Input
                  id="birthday"
                  type="date"
                  className="block"
                  {...field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value
                  }
                />
              </FormControl>
              <FormDescription>
                Legg til bursdagen din, og få den vist på echoscreen i lesesalen!🎉
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasReadTerms"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start space-y-2">
              <div className="flex space-x-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Jeg bekrefter at jeg har lest{" "}
                    <Link
                      className="font-medium underline transition-colors duration-200 after:content-['_↗'] hover:text-blue-500"
                      href="/om/retningslinjer"
                    >
                      de etiske retnlingslinjene
                    </Link>
                    .
                  </FormLabel>
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start space-y-2">
              <div className="flex space-x-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Jeg vil ha{" "}
                    <span className="group relative cursor-pointer underline">
                      offentlig bruker
                      <Card className="absolute top-full left-0 mt-1 hidden w-max bg-gray-800 p-2 text-sm text-white shadow-md group-hover:block">
                        Dette betyr at profilen din vil være synlig for andre brukere.
                      </Card>
                    </span>
                  </FormLabel>
                </div>
              </div>
            </FormItem>
          )}
        />

        <div>
          <Button type="submit">{isLoading ? "Lagrer..." : "Lagre"}</Button>
        </div>
      </form>
    </Form>
  );
};
