"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";

import { type Degree } from "@echo-webkom/db/schemas";

import { addDegreeAction, editDegreeAction, removeDegreeAction } from "@/actions/degree";
import { Text } from "@/components/typography/text";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
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

export const AddDegreeButton = ({ initialDegree, ...props }: AddDegreeButtonProps) => {
  const isEditing = !!initialDegree?.id;

  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { executeAsync: executeAddDegree } = useAction(addDegreeAction);
  const { executeAsync: executeEditDegree } = useAction(editDegreeAction);
  const { executeAsync: executeRemoveDegree } = useAction(removeDegreeAction);

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
      const resp = await executeAddDegree(degreeData);
      const message = resp?.data?.message;

      if (message) {
        toast({
          title: message,
          variant: "success",
        });
      }

      return;
    }

    if (action === "update") {
      const resp = await executeEditDegree(degreeData);

      const message = resp?.data?.message;

      if (message) {
        toast({
          title: message,
          variant: "success",
        });

        form.reset();
      }

      return;
    }
  });

  const handleDelete = async () => {
    if (!initialDegree) return;

    const result = await executeRemoveDegree(initialDegree.id);

    if (result?.data) {
      toast({
        title: result.data?.message,
        variant: "success",
      });
    }
  };

  const actionTitle = isEditing ? "Endre" : "Legg til";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...props} />
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>{actionTitle} en studieretning</DialogTitle>
            </DialogHeader>

            <DialogBody className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Navn</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Datasikkerhet"
                          autoComplete="off"
                          {...field}
                        />
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
                        En unik ID til studieretningen. Burde være den offisielle forkortelsen.
                        F.eks. Datasikkerhet = dsik
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

              <div className="flex items-center gap-2 py-2">
                {!isConfirmOpen && isEditing && (
                  <Button size="sm" variant="destructive" onClick={() => setIsConfirmOpen(true)}>
                    Slett studieretning
                  </Button>
                )}

                {isConfirmOpen && (
                  <>
                    <Text className="font-bold">Sikker?</Text>

                    <Button size="sm" variant="secondary" onClick={() => setIsConfirmOpen(false)}>
                      Avbryt
                    </Button>
                    <Button size="sm" onClick={handleDelete} variant="destructive">
                      Ja, slett
                    </Button>
                  </>
                )}
              </div>
            </DialogBody>

            <DialogFooter>
              <Button size="sm" variant="destructive" onClick={() => setIsOpen(false)}>
                Avbryt
              </Button>
              <Button size="sm" type="submit">
                Lagre
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
