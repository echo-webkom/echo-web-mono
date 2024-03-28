"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { type Group } from "@echo-webkom/db/schemas";

import { updateUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { type AllUsers } from "./page";
import { userFormSchema } from "./schemas";

type UserFormProps = {
  user: AllUsers[number];
  groups: Array<Group>;
};

export function UserForm({ user, groups }: UserFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      memberships: user.memberships.map((membership) => membership.groupId),
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    const response = await updateUser({
      userId: user.id,
      memberships: data.memberships,
    });

    setIsLoading(false);

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

    router.refresh();
  });

  return (
    <Dialog>
      <DialogTrigger>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="pr-10">
          Endre rolle
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Detaljer for {user.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div>
            <Label>ID</Label>
            <p className="text-sm text-muted-foreground">{user.id}</p>
          </div>

          <div>
            <Label>Rolle</Label>
            <p className="text-sm text-muted-foreground">{user.alternativeEmail}</p>
          </div>

          <div>
            <Label>Studieretning</Label>
            <p className="text-sm text-muted-foreground">{user.degree?.name ?? "Ikke valgt"}</p>
          </div>

          <div>
            <Label>År</Label>
            <p className="text-sm text-muted-foreground">{user.year ?? "Ikke valgt"}</p>
          </div>

          <div>
            <Label>Navn</Label>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>
          <div>
            <Label>E-post</Label>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <Form {...form}>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <form onSubmit={onSubmit} className="space-y-8">
              <FormField
                control={form.control}
                name="memberships"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>Undergrupper</FormLabel>
                      <FormDescription>
                        Velg de undergruppene brukeren er en del av.
                      </FormDescription>
                    </div>

                    {groups.map(({ id, name }) => (
                      <FormField
                        key={id}
                        control={form.control}
                        name="memberships"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={id}
                              className="flex flex-row items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== id),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">{name}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{isLoading ? "Lagrer..." : "Lagre endringer"}</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
