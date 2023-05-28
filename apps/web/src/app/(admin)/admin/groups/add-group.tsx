"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {PlusIcon} from "@radix-ui/react-icons";
import {useForm} from "react-hook-form";
import {AiOutlineLoading} from "react-icons/ai";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import Input from "@/components/ui/input";
import {useToast} from "@/hooks/use-toast";

const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export function AddGroup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
  });

  const {toast} = useToast();
  const router = useRouter();

  const onSubmit = methods.handleSubmit(async (data) => {
    setIsLoading(true);
    const resp = await fetch("/api/group", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setIsLoading(false);

    if (!resp.ok) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Values",
      description: JSON.stringify(data, null, 2),
      variant: "success",
    });
    setIsOpen(false);
    methods.reset();
    router.refresh();
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={isLoading}>
          {isLoading ? (
            <AiOutlineLoading className="mr-2 animate-spin" />
          ) : (
            <PlusIcon className="mr-2 h-5 w-5" />
          )}
          Legg til gruppe
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Legg til en gruppe</DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <FormField
              control={methods.control}
              name="id"
              render={({field}) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input placeholder="ID på gruppe" {...field} />
                  </FormControl>
                  <FormDescription>
                    ID for gruppen, brukes til å identifisere gruppen i andre systemer
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Navn</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" placeholder="Navn på gruppe" {...field} />
                  </FormControl>
                  <FormDescription>Navnet på gruppen som vises til brukere</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              {isLoading ? <AiOutlineLoading className="mr-2 animate-spin" /> : null}
              Legg til gruppe
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
