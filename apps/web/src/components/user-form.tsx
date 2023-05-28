"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Degree, type User} from "@echo-webkom/db/types";
import {degreeToString} from "@echo-webkom/lib";

import {useToast} from "@/hooks/use-toast";
import {Button} from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import Input from "./ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";

const userSchema = z.object({
  alternativeEmail: z.string().email().or(z.literal("")).optional(),
  degree: z.nativeEnum(Degree).optional(),
  year: z
    .number()
    .min(1)
    .max(5)
    .optional()
    .transform((value) => (value ? Number(value) : undefined)),
});

export default function UserForm({
  id,
  alternativeEmail,
  degree,
  year,
}: {
  id: User["id"];
  alternativeEmail: User["alternativeEmail"];
  degree: User["degree"];
  year: User["year"];
}) {
  const [isLoading, setIsLoading] = useState(false);

  const {toast} = useToast();
  const router = useRouter();
  const methods = useForm<z.infer<typeof userSchema>>({
    defaultValues: {
      alternativeEmail: alternativeEmail ?? undefined,
      degree: degree ?? undefined,
      year: year ?? undefined,
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
        variant: "destructive",
      });
    },
  );

  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <FormField
          control={methods.control}
          name="alternativeEmail"
          render={({field}) => (
            <FormItem>
              <FormLabel htmlFor="alternativeEmail">Alternativ e-post</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Din e-post" {...field} />
              </FormControl>
              <FormDescription>
                Brukes til å sende deg e-post om du ikke vil bruke din UiB e-post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="degree"
          render={({field}) => (
            <FormItem>
              <FormLabel htmlFor="degree">Studieretning</FormLabel>
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
              <FormDescription>
                Din studieretning er nødvendig for å kunne melde deg på arrangementer
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="year"
          render={({field}) => (
            <FormItem>
              <FormLabel htmlFor="year">Årstrinn</FormLabel>
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
              <FormDescription>
                Årstrinn er nødvendig for å kunne melde deg på arrangementer
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={!methods.formState.isDirty || isLoading} type="submit">
          {isLoading ? "Lagrer..." : "Lagre"}
        </Button>
      </form>
    </Form>
  );
}
