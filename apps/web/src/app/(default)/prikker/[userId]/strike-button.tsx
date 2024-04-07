"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { type Happening } from "@echo-webkom/db/schemas";
import {
  STRIKE_TYPE_AMOUNT,
  STRIKE_TYPE_MESSAGE,
  type StrikeType,
} from "@echo-webkom/lib/src/constants";

import { addStrike, remvoveStrike } from "@/actions/strikes";
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
import { Textarea } from "@/components/ui/textarea";
import { unbanUser } from "@/data/users/mutations";
import { toast, useToast } from "@/hooks/use-toast";
import { addStrikesSchema, type AddStrikeForm } from "@/lib/schemas/addStrike";
import { mailTo } from "@/utils/prefixes";
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

type AddStrikeButtonProps = {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
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

  const [selectedType, setSelectedType] = useState<StrikeType>("OTHER");

  const form = useForm<AddStrikeForm>({
    resolver: zodResolver(addStrikesSchema),
    defaultValues: {
      happeningId: "",
      amount: 1,
      reason: "",
      hasVerified: false,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const { success, message } = await addStrike(
      user.id,
      data.happeningId,
      data.reason,
      data.amount,
      currentAmount,
      selectedType,
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
    const type = choice.target.value as StrikeType;
    setSelectedType(type);

    form.setValue("amount", STRIKE_TYPE_AMOUNT[type]);
    form.setValue("reason", STRIKE_TYPE_MESSAGE[type]);

    form.clearErrors("amount");
    if (form.getValues("reason") !== "") form.clearErrors("reason");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps}>Gi prikker</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gi prikker</DialogTitle>
          <DialogDescription>Brukeren blir utestengt av 5 gyldige prikker.</DialogDescription>
          <div>Navn: {user.name}</div>
          <div>
            E-post: <Link href={mailTo(user.email)}>{user.email}</Link>
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
                        <option defaultValue={"OTHER"}>Egendefinert </option>
                        {Object.entries(STRIKE_TYPE_MESSAGE)
                          .filter(([key, _]) => key !== "OTHER")
                          .map(([key, value]) => (
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
                render={({ field }) => {
                  const { onChange, ...restField } = field;
                  return (
                    <FormItem>
                      <FormLabel htmlFor="amount">Antall prikker</FormLabel>
                      <FormControl>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Antall prikker..."
                          min={1}
                          max={5}
                          onChange={(e) => {
                            onChange(parseInt(e.target.value));
                          }}
                          {...restField}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
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
                    <div className="flex items-center">
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
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-5 flex flex-col gap-2">
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
      <DialogTrigger>
        <div className="text-destructive hover:underline">Slett prikk</div>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription>
          <div className="font-bold ">Merk:</div>
          <div>Utestengelser blir ikke automatisk fjernet ved å slette prikker.</div>
          <div>Det må gjøres manuelt.</div>
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

type RemoveBanButtonProps = {
  userId: string;
} & ButtonProps;

export function RemoveBanButton({ userId, ...buttonProps }: RemoveBanButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  async function handleUnban() {
    const { success, message } = await unbanUser(userId);

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
        <Button {...buttonProps}>Fjern utestengelse</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription>
          <div className="font-bold ">Merk:</div>
          <div>Gyldige prikker blir ikke slettet av å fjerne utestengelsen.</div>
          <div>De må eventuelt fjernes manuelt.</div>
        </DialogDescription>
        <DialogFooter>
          <Button variant="destructive" onClick={() => void handleUnban()}>
            Bekreft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
