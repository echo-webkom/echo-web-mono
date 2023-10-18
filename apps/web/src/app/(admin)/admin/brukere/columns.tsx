"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";

import { type User as DbUser, type Group } from "@echo-webkom/db";
import { groupNames, groupToString, roleToString } from "@echo-webkom/lib";

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
import { updateUserAction } from "./action";
import { userFormSchema } from "./schemas";

export type User = DbUser;

export const columns: Array<ColumnDef<User>> = [
  {
    accessorKey: "name",
    header: "Navn",
  },
  {
    accessorKey: "studentGroups",
    header: "Studentgrupper",
    cell: ({ row }) => {
      const groups = row.getValue<Array<Group>>("studentGroups");

      return (
        <div>
          {groups.length ? groups.map((group) => groupToString[group]).join(", ") : "Ingen grupper"}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Rolle",
    cell: ({ row }) => {
      const role = row.getValue<DbUser["role"]>("role");

      return <div>{roleToString[role]}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
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
            <UserForm user={user} />
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function UserForm({ user }: { user: User }) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      groups: user.studentGroups,
      role: user.role,
    },
  });
  const onSubmit = form.handleSubmit(async (data) => {
    const { result } = await updateUserAction(user.id, data);
    if (result === "success") {
      toast({
        title: "Bruker oppdatert!",
        description: "Brukeren ble oppdatert.",
      });
      router.refresh();
    } else {
      toast({
        title: "Noe gikk galt!",
        description: "Kunne ikke oppdatere bruker.",
      });
    }
  });

  return (
    <Dialog>
      <DialogTrigger>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Endre rolle</DropdownMenuItem>
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
                name="role"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Administrator</FormLabel>
                      <FormDescription>
                        Skal brukeren ha tilgang til admin dashboard?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === "ADMIN"}
                        onCheckedChange={(checked) => {
                          return checked ? field.onChange("ADMIN") : field.onChange("USER");
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="groups"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Undergrupper</FormLabel>
                      <FormDescription>
                        Velg de undergruppene brukeren er en del av.
                      </FormDescription> 
                    </div>

                    {Object.entries(groupNames).map(([id, label]) => (
                      <FormField
                        key={id}
                        control={form.control}
                        name="groups"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(id as Group)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== id),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">{label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                <span>Lagre</span>
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
