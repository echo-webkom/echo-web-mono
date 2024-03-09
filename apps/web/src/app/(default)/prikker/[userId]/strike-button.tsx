"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { type Happening } from "@echo-webkom/db/schemas";

import { manualAddStrike, remvoveStrike } from "@/actions/strikes";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/hooks/use-toast";
import { addStrikesSchema, type AddStrikeForm } from "@/lib/schemas/addStrike";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Select } from "../../../../components/ui/select";

export type ManualStrikeType = "NO_SHOW" | "WRONG_INFO" | "TOO_LATE" | "NO_FEEDBACK" | "OTHER";

const STRIKE_TYPE_MESSAGE: Record<ManualStrikeType, string> = {
  NO_SHOW: "Du møtte ikke opp.",
  WRONG_INFO: "Du ga feil informasjon.",
  TOO_LATE: "Du kom for sent.",
  NO_FEEDBACK: "Du ga ikke tilbakemelding.",
  OTHER: "",
};

const STRIKE_TYPE_AMOUNT: Record<ManualStrikeType, string> = {
  NO_SHOW: "1",
  WRONG_INFO: "1",
  TOO_LATE: "1",
  NO_FEEDBACK: "1",
  OTHER: "1",
};

type AddStrikeButtonProps = {
  user: { id: string; name: string | null; email: string };
  happenings: Array<Happening>;
  currentAmount: number;
} & ButtonProps;

export function AddStrikeButton({
  user,
  happenings,
  currentAmount,
  ...buttonProps
}: AddStrikeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const [selectedType, setSelectedType] = useState<ManualStrikeType>("OTHER");

  const form = useForm<AddStrikeForm>({
    resolver: zodResolver(addStrikesSchema),
    defaultValues: {
      happeningId: "",
      amount: "",
      reason: "",
      hasVerified: false,
    },
  });

  console.log(selectedType);

  const onSubmit = form.handleSubmit(async (data) => {
    const { success, message } = await manualAddStrike(
      user.id,
      data.happeningId,
      data.reason,
      parseInt(data.amount),
      currentAmount,
    );

    toast({
      title: message,
      variant: success ? "success" : "destructive",
    });

    setIsOpen(false);
    form.reset();
    router.refresh();
  });

  function handleTypeChange(choice: ChangeEvent<HTMLSelectElement>) {
    const type = choice.target.value as ManualStrikeType;
    setSelectedType(type);

    form.setValue("amount", STRIKE_TYPE_AMOUNT[type]);
    form.setValue("reason", STRIKE_TYPE_MESSAGE[type]);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps}>Gi prikker</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gi prikker</DialogTitle>
          <DialogDescription>
            Merk at brukeren kan bli utestengt fra kommende bedriftspresentasjoner. Brukeren har
            oversikt over sine egne prikker og begrunnelser for dem.
          </DialogDescription>
          <div className="flex flex-col gap-2">
            <Label className="text-bold">Navn: </Label>
          </div>
          <div className="flex flex-col gap-2">
            <Label>e-post:</Label>
            <Label></Label>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmit();
            }}
          >
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="happeningId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="happeningId">Velg bedpres</FormLabel>
                    <FormControl>
                      <Select id="happeningId" {...field}>
                        <option hidden>Velg bedpres...</option>
                        {happenings.map((bedpres) => (
                          <option key={bedpres.id} value={bedpres.id}>
                            {bedpres.title}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="type">Type prikk</FormLabel>
                    <FormControl>
                      <Select id="type" {...field} onChange={(choice) => handleTypeChange(choice)}>
                        <option selected value={"OTHER"}>
                          Egendefinert
                        </option>
                        {Object.entries(STRIKE_TYPE_MESSAGE).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="amount">Antall prikker</FormLabel>
                    <FormControl>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Antall prikker..."
                        min={1}
                        max={10}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="reason" required>
                      Begrunnelse
                    </FormLabel>
                    <FormControl>
                      <Textarea id="reason" placeholder="Skriv begrunnelse..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasVerified"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="hasVerified" required>
                      Jeg er kjent med Bedkom sine retningslinjer for prikker.
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        id="hasVerified"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-5 flex flex-col gap-2">
              <Button
                className="w-full sm:w-auto"
                variant="secondary"
                onClick={() => {
                  setIsOpen(false);
                  form.reset();
                }}
              >
                Avbryt
              </Button>
              <Button className="w-full sm:w-auto" type="submit">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function RemoveStrikeButton({ strikeId }: { strikeId: number }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete() {
    const { success, message } = await remvoveStrike(strikeId);

    toast({
      title: message,
      variant: success ? "success" : "destructive",
    });

    setIsOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-red-500">
          Slett prikk
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription>
          Merk at en eventuell utestening ikke blir automatisk fjernet. Dette må gjøres manuelt.
        </DialogDescription>
        <DialogFooter>
          <Button variant="destructive" onClick={() => void handleDelete()}>
            Bekreft sletting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
