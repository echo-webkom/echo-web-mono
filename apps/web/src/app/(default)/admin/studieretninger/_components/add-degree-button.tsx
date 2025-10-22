"use client";

import { useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";

import { type Degree } from "@echo-webkom/db/schemas";

import { addDegree, editDegree, removeDegree } from "@/actions/degree";
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

  const form = useForm<DegreeForm>({
    resolver: standardSchemaResolver(degreeFormSchema),
    defaultValues: {
      id: initialDegree?.id ?? "",
      name: initialDegree?.name ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const { action, ...degreeData } = data;

    if (action === "create") {
      const result = await addDegree(degreeData);

      toast({
        title: result.message,
        variant: result.success ? "success" : "info",
      });

      if (result.success) {
        form.reset();
      }

      return;
    }

    if (action === "update") {
      const result = await editDegree(degreeData);

      toast({
        title: result.message,
        variant: result.success ? "success" : "info",
      });

      return;
    }
  });

  const handleDelete = async () => {
    if (!initialDegree) return;

    const result = await removeDegree(initialDegree.id);

    toast({
      title: result.message,
      variant: result.success ? "success" : "info",
    });
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
