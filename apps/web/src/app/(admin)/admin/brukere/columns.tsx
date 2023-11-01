"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { capitalize } from "@/utils/string";
import { type AllUsers } from "./page";
import { userFormSchema } from "./schemas";

export const columns: Array<
  ColumnDef<{
    user: AllUsers[number];
    groups: Array<Group>;
  }>
> = [
  {
    accessorKey: "name",
    header: "Navn",
    cell: ({ row }) => {
      const { user } = row.original;

      return <div>{user.name}</div>;
    },
  },
  {
    accessorKey: "memberships",
    header: "Studentgrupper",
    cell: ({ row }) => {
      const { user } = row.original;

      return (
        <div>
          {user.memberships.length
            ? user.memberships.map((membership) => membership.group.name).join(", ")
            : "Ingen grupper"}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Brukertype",
    cell: ({ row }) => {
      const { user } = row.original;

      return <div>{capitalize(user.type)}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { user, groups } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Gjør endringer</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <UserForm user={user} groups={groups} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type UserFormProps = {
  user: AllUsers[number];
  groups: Array<Group>;
};

function UserForm({ user, groups }: UserFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      memberships: user.memberships.map((membership) => membership.group.id),
      type: user.type,
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
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Detaljer for {user.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="mb-2">
            <Label>Navn</Label>
            <p className="text-sm text-slate-500">{user.name}</p>
          </div>
          <div className="mb-2">
            <Label>E-post</Label>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <Form {...form}>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <form onSubmit={onSubmit} className="space-y-8">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Administrator</FormLabel>
                        <FormDescription>
                          Skal brukeren ha tilgang til admin dashboard?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "admin"}
                          onCheckedChange={(checked) => {
                            return checked ? field.onChange("admin") : field.onChange("student");
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="memberships"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Undergrupper</FormLabel>
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
                              className="flex flex-row items-start space-x-3 space-y-0"
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
                              <FormLabel className="text-sm font-normal">{name}</FormLabel>
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
