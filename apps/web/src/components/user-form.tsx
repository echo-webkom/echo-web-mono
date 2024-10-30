"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type Degree } from "@echo-webkom/db/schemas";

import { updateSelf } from "@/actions/user";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/utils/cn";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select } from "./ui/select";

const userSchema = z.object({
  alternativeEmail: z.string().email().or(z.literal("")).optional(),
  degree: z.string().optional(),
  year: z.coerce.number().min(1).max(6).optional(),
  hasReadTerms: z.boolean().optional(),
  birthday: z.date().optional(),
});

type UserFormProps = {
  user: {
    alternativeEmail?: string;
    degree?: Degree;
    year?: number;
    hasReadTerms?: boolean;
    id: string;
    birthday: Date;
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
      <form onSubmit={onSubmit} className="space-y-8">
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
              <FormLabel htmlFor="birthday">Bursdag</FormLabel>
              <br></br>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "flex h-10 w-full justify-start rounded-md border-2 border-border bg-input px-3 py-2 text-sm font-semibold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Legg til Bursdag</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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

        <div>
          <Button type="submit">{isLoading ? "Lagrer..." : "Lagre"}</Button>
        </div>
      </form>
    </Form>
  );
};
