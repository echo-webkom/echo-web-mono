"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { useUnoClient } from "@/providers/uno";

const intgroupRequestSchema = z.object({
  groupName: z.string().trim().min(1, "Skriv inn navnet på gruppen."),
  description: z.string().trim().min(1, "Skriv inn en beskrivelse av gruppen."),
  interestedPeople: z.string().trim().min(1, "Skriv inn navnene på personene som er interesserte."),
  purpose: z.string().trim().min(1, "Skriv inn hvorfor gruppen bør finnes og hvem den er for."),
  needsFromHovedstyre: z.string(),
  contactEmail: z.string().trim().email("Skriv inn en gyldig e-postadresse."),
});

type IntgroupRequestForm = z.infer<typeof intgroupRequestSchema>;

export function IntgroupRequestDialog() {
  const unoClient = useUnoClient();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<IntgroupRequestForm>({
    resolver: standardSchemaResolver(intgroupRequestSchema),
    defaultValues: {
      groupName: "",
      description: "",
      interestedPeople: "",
      purpose: "",
      needsFromHovedstyre: "",
      contactEmail: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await unoClient.groups.createIntgroupRequest({
        ...data,
        needsFromHovedstyre: data.needsFromHovedstyre.trim() || undefined,
      });
      toast.success("Forespørselen er sendt inn.");
      form.reset();
      setIsOpen(false);
    } catch {
      toast.error("Kunne ikke sende inn forespørselen.");
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Foreslå ny interessegruppe</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Foreslå ny interessegruppe</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="groupName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Navn på gruppen</FormLabel>
                    <FormControl>
                      <Input placeholder="Navnet på gruppen" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Beskrivelse av gruppen</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Hva skal gruppen gjøre?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestedPeople"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Personer som er interesserte i å starte gruppen</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Navn på interesserte personer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Hvorfor bør gruppen finnes, og hvem er den for?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Fortell om målgruppen og formålet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="needsFromHovedstyre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Trenger dere noe fra Hovedstyre for å komme i gang?{" "}
                      <span className="text-muted-foreground font-normal">(valgfritt)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Beskriv eventuelle behov" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Kontakt-e-post</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="navn@eksempel.no" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="px-0 pb-0">
                <Button variant="outline" onClick={() => setIsOpen(false)} type="button">
                  Avbryt
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Sender..." : "Send inn"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
