"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { type Degree } from "@echo-webkom/db/schemas";

import { addDegree, editDegree, removeDegree } from "@/actions/degree";
import { Text } from "@/components/typography/text";
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
import { degreeFormSchema, type DegreeForm } from "@/lib/schemas/add-degree";

type AddDegreeButtonProps = ButtonProps & {
  initialDegree?: Degree;
};

export default function AddDegreeButton({ initialDegree, ...props }: AddDegreeButtonProps) {
  const isEditing = !!initialDegree?.id;

  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const form = useForm<DegreeForm>({
    resolver: zodResolver(degreeFormSchema),
    defaultValues: {
      id: initialDegree?.id ?? "",
      name: initialDegree?.name ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const { action, ...degreeData } = data;

    if (action === "create") {
      const response = await addDegree(degreeData);

      toast({
        title: response.success ? "Studieretningen ble lagt til" : response.message,
        variant: response.success ? "success" : "info",
      });

      if (response.success) {
        form.reset();
      }

      return;
    }

    if (action === "update") {
      const response = await editDegree(degreeData);

      toast({
        title: response.success ? "Studieretningen ble oppdatert" : response.message,
        variant: response.success ? "success" : "info",
      });

      return;
    }
  });

  const handleDelete = async () => {
    if (!initialDegree) return;

    const response = await removeDegree(initialDegree.id);

    toast({
      title: response.success ? "Studieretningen ble slettet" : response.message,
      variant: response.success ? "success" : "info",
    });
  };

  const actionTitle = isEditing ? "Endre" : "Legg til";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...props} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{actionTitle} en studieretning</DialogTitle>
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
                      <Input id="name" placeholder="Datasikkerhet" autoComplete="off" {...field} />
                    </FormControl>
                    <FormDescription>Navn på studieretningen</FormDescription>
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
                      <Input
                        id="id"
                        placeholder="dsik"
                        autoComplete="off"
                        readOnly={isEditing}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      En unik ID til studieretningen. Burde være den offisielle forkortelsen. F.eks.
                      Datasikkerhet = dsik
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <input
              type="hidden"
              {...form.register("action", {
                value: isEditing ? "update" : "create",
              })}
            />

            {!isConfirmOpen && isEditing && (
              <div>
                <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>
                  Slett studieretning
                </Button>
              </div>
            )}

            {isConfirmOpen && (
              <div className="flex items-center gap-2">
                <Text className="font-bold">Sikker?</Text>

                <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
                  Avbryt
                </Button>
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <Button onClick={handleDelete} variant="destructive">
                  Ja, slett
                </Button>
              </div>
            )}

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
