"use client";

import { useState, type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { removeWhitelist, upsertWhitelist } from "@/actions/whitelist";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const whitelistFormSchema = z.object({
  email: z.string().email("Ugyldig e-post"),
  days: z.coerce.number().positive("Må være et positivt tall"),
  reason: z.string().min(3, "Må være minst 3 tegn"),
});
type WhitelistForm = z.infer<typeof whitelistFormSchema>;

type Props = {
  whitelistEntry?: {
    email: string;
    reason: string;
  };
} & ButtonProps;

export const WhitelistButton = ({
  children,
  whitelistEntry,
  ...buttonProps
}: PropsWithChildren<Props>) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<WhitelistForm>({
    resolver: zodResolver(whitelistFormSchema),
    defaultValues: {
      email: whitelistEntry?.email ?? "",
      days: 30,
      reason: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const { success, message } = await upsertWhitelist(data.email, data.reason, data.days);

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    setIsOpen(false);
    router.refresh();
  });

  const handleDelete = async () => {
    if (!whitelistEntry) {
      toast({
        title: "Denne personen er kanskje ikke i whitelist",
        variant: "warning",
      });
      return;
    }

    const { success, message } = await removeWhitelist(whitelistEntry.email);

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    setIsOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps}>{children ?? "åpne"}</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Legg til whitelist</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-post</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="Din e-post"
                          disabled={whitelistEntry?.email !== undefined}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dager</FormLabel>
                      <FormControl>
                        <Input id="days" placeholder="30" {...field} type="number" />
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
                      <FormLabel>Grunn</FormLabel>
                      <FormControl>
                        <Input
                          id="reason"
                          placeholder={whitelistEntry?.reason ?? "Grunn for whitelisting"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DialogBody>
            <DialogFooter>
              {whitelistEntry && (
                <Button size="sm" variant="destructive" onClick={() => void handleDelete()}>
                  Slett
                </Button>
              )}
              <Button size="sm" type="submit">
                Lagre
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
