"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RxPlus as Plus } from "react-icons/rx";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const form = useForm<z.infer<typeof addUserToGroupSchema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(addUserToGroupSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const { success, message } = await addUserToGroup(data.email, group.id);

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    if (!success) {
      return;
    }

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
            <DialogBody>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">E-post</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="andreas@student.uib.no" />
                    </FormControl>
                    <FormDescription>
                      Dette er samme e-post som brukeren har på profil-siden sin som slutter med
                      @student.uib.no.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>
            <DialogFooter>
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
