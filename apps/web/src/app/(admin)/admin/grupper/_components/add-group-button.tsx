"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { addGroup } from "@/actions/groups";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { groupFormSchema, type GroupForm } from "@/lib/schemas/add-group";
import { slugify } from "@/utils/slugify";

export default function AddGroupButton({ ...props }: ButtonProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<GroupForm>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      id: "",
      name: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await addGroup(data);

    if (response.success) {
      toast({
        title: response.data,
        variant: "success",
      });
    } else {
      toast({
        title: response.message,
        variant: "destructive",
      });
    }

    form.reset();
  });

  const generateGroupSlug = () => {
    const name = form.getValues("name");

    form.setValue("id", slugify(name));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...props} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Legg til gruppe</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form className="grid gap-4 py-4" onSubmit={onSubmit}>
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Navn</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="Webkom" autoComplete="off" {...field} />
                    </FormControl>
                    <FormDescription>Navn på undergruppen</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          className="flex-1"
                          id="id"
                          placeholder="webkom"
                          autoComplete="off"
                          {...field}
                        />
                        <Button variant="outline" onClick={generateGroupSlug}>
                          Generer ID
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      En unik ID til studieretningen. Burde være en slugifisert versjon av navnet.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Avbryt
              </Button>
              <Button type="submit">Lagre</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
