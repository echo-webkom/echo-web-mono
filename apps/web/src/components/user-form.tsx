"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";


import { type Degree } from "@echo-webkom/db/schemas";

import { updateSelf } from "@/actions/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
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
  year: z.coerce.number().min(1).max(5).optional(),
  hasReadTerms: z.boolean().optional(),
});

type UserFormProps = {
  user: {
    alternativeEmail?: string;
    degree?: Degree;
    year?: number;
    hasReadTerms?: boolean;
    id: string;
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
              <FormDescription>Om du ønsker å få e-post tilsendt en annen mail.</FormDescription>
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

        <FormField
          control={form.control}
          name="hasReadTerms"
          render={() => (
            <FormItem>
              <FormLabel htmlFor="hasReadTerms">
                Les våre retningslinjer for å kunne melde deg på arrangement.
              </FormLabel>
              <br />

              <AlertDialog>
                <AlertDialogTrigger className="underline-offset-4 hover:underline">
                  Les retninslinjene her
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>Retninslinjene</AlertDialogHeader>
                  <p>Du må være kul bro</p>
                  <AlertDialogFooter>
                    <div className="space-y-4">
                      <div className="flex">
                        <FormControl>
                          <Checkbox
                            value={user.hasReadTerms ? "true" : "false"}
                            id="hasReadTerms"
                          />
                        </FormControl>
                        <FormLabel htmlFor="hasReadTerms" className="px-2">
                          Jeg har lest retningslingene
                        </FormLabel>
                      </div>
                      <div className="space-x-2">
                        <AlertDialogCancel>Avbryt</AlertDialogCancel>
                        <AlertDialogAction>Fortsett</AlertDialogAction>
                      </div>
                    </div>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
};
