"use client";

import { type Group } from "@echo-webkom/db/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
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
import { useUnoClient } from "@/providers/uno";

import { type AllUsers } from "./page";
import { userFormSchema } from "./schemas";

type UserFormProps = {
  user: AllUsers[number];
  groups: Array<Group>;
};

export const UserForm = ({ user, groups }: UserFormProps) => {
  const router = useRouter();
  const unoClient = useUnoClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: standardSchemaResolver(userFormSchema),
    defaultValues: {
      memberships: user.groups.map((group) => group.id),
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      const currentMembershipIds = new Set(user.groups.map((g) => g.id));
      const newMembershipIds = new Set(data.memberships);

      // Add user to new groups
      for (const groupId of data.memberships) {
        if (!currentMembershipIds.has(groupId)) {
          await unoClient.groups.addUser(groupId, user.id);
        }
      }

      // Remove user from removed groups
      for (const groupId of user.groups.map((g) => g.id)) {
        if (!newMembershipIds.has(groupId)) {
          await unoClient.groups.removeUser(groupId, user.id);
        }
      }

      toast.success("Brukeren ble oppdatert");
    } catch {
      toast.error("Kunne ikke oppdatere brukeren");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  });

  return (
    <Dialog>
      <DialogTrigger>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="pr-10">
          Endre rolle
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Detaljer for {user.name}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <div className="flex flex-col gap-2">
                <div>
                  <Label>ID</Label>
                  <p className="text-muted-foreground text-sm">{user.id}</p>
                </div>

                <div>
                  <Label>Rolle</Label>
                  <p className="text-muted-foreground text-sm">{user.alternativeEmail}</p>
                </div>

                <div>
                  <Label>Studieretning</Label>
                  <p className="text-muted-foreground text-sm">
                    {user.degree?.name ?? "Ikke valgt"}
                  </p>
                </div>

                <div>
                  <Label>År</Label>
                  <p className="text-muted-foreground text-sm">{user.year ?? "Ikke valgt"}</p>
                </div>

                <div>
                  <Label>Navn</Label>
                  <p className="text-muted-foreground text-sm">{user.name}</p>
                </div>
                <div>
                  <Label>E-post</Label>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>

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
                                className="flex flex-row items-center space-y-0 space-x-3"
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
              </div>
            </DialogBody>
            <DialogFooter>
              <Button size="sm" type="submit">
                {isLoading ? "Lagrer..." : "Lagre endringer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
