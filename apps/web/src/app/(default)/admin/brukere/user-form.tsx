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
import { useToast } from "@/hooks/use-toast";
import { type AllUsers } from "./page";
import { userFormSchema } from "./schemas";

type UserFormProps = {
  user: AllUsers[number];
  groups: Array<Group>;
};

export const UserForm = ({ user, groups }: UserFormProps) => {
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

    const { success, message } = await updateUser(user.id, data);

    setIsLoading(false);

    toast({
      title: message,
      variant: success ? "success" : "destructive",
    });

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
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Detaljer for {user.name}</DialogTitle>
            </DialogHeader>
            <DialogBody>
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
                  <p className="text-sm text-muted-foreground">
                    {user.degree?.name ?? "Ikke valgt"}
                  </p>
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
