"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBodyOverflow,
  DialogClose,
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
import { UserSearchSelect } from "@/components/user-search-select";
import { addUserToGroupSchema } from "@/lib/schemas/add-user-to-group";

import { addUserToGroup } from "../actions";

type AddUserToGroupDialogProps = {
  group: {
    id: string;
    name: string;
  };
};

export const AddUserToGroupDialog = ({ group }: AddUserToGroupDialogProps) => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<z.infer<typeof addUserToGroupSchema>>({
    defaultValues: {
      userId: "",
    },
    resolver: standardSchemaResolver(addUserToGroupSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const { success, message } = await addUserToGroup(data.userId, group.id);

    if (!success) {
      toast.warning(message);
      return;
    }

    toast.success(message);
    form.reset();
    setSearchQuery("");
    router.refresh();
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Legg til bruker i {group.name}
              </DialogTitle>
            </DialogHeader>
            <DialogBodyOverflow>
              <FormField
                name="userId"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel htmlFor="user">Bruker</FormLabel>
                    <FormControl>
                      <UserSearchSelect
                        value={searchQuery}
                        onInputChangeAction={(query) => {
                          setSearchQuery(query);
                          form.setValue("userId", "");
                        }}
                        onSelectAction={(user) => {
                          form.setValue("userId", user.id);
                          setSearchQuery(user.name);
                        }}
                        placeholder="Søk etter bruker..."
                        minCharsText="Skriv minst 3 tegn"
                      />
                    </FormControl>
                    <FormDescription>
                      Søk etter navn på brukeren du vil legge til i gruppen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBodyOverflow>
            <DialogFooter>
              <Button
                size="sm"
                type="submit"
                disabled={!form.watch("userId") || form.formState.isSubmitting}
              >
                Legg til
              </Button>
              <DialogClose asChild>
                <Button size="sm">Lukk</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
