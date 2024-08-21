"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BiCheckCircle } from "react-icons/bi";

import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { requestAccess } from "../_actions/request-access";
import { requestAccessSchema, type IRequestAccessForm } from "../_lib/request-access";

type RequestAccessFormProps = {
  email: string;
};

export const RequestAccessForm = ({ email }: RequestAccessFormProps) => {
  const { toast } = useToast();
  const [id, setId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const router = useRouter();

  const form = useForm<IRequestAccessForm>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      email,
      reason: "",
    },
  });

  const onSubmit = form.handleSubmit(
    async (data) => {
      const resp = await requestAccess(data);

      if (!resp.success) {
        toast({
          title: resp.message,
          variant: "destructive",
        });
        return;
      }

      setId(resp.data.id);
      setCountdown(5);

      form.reset();
    },
    (error) => {
      console.error(error);
    },
  );

  useEffect(() => {
    if (countdown === null) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev === 0) {
          router.push("/");
          return null;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  });

  if (id) {
    return (
      <div>
        <hr className="py-4" />

        <BiCheckCircle size={64} className="mx-auto mb-4 text-green-500" />

        <Text>
          Din forespørsel om tilgang er sendt inn. Du vil motta en e-post, på {email}, når vi har
          behandlet forespørselen din.
        </Text>

        <Text>
          Du blir sendt tilbake til <Link href="/">forsiden</Link> om {countdown} sekunder...
        </Text>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">E-post</FormLabel>
                <FormControl>
                  <Input readOnly id="email" placeholder="Din e-post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="reason">Begrunnelse</FormLabel>
                <FormControl>
                  <Textarea id="reason" placeholder="Din begrunnelse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <small>
            Les mer om{" "}
            <Link className="underline" href="/om/vedtekter#§-2-medlemmer">
              medlemskap
            </Link>{" "}
            i vedtektene våres.
          </small>
        </div>

        <div>
          <Button className="w-full sm:w-auto" type="submit">
            Send inn
          </Button>
        </div>
      </form>
    </Form>
  );
};
