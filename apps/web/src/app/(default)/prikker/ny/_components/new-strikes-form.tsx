"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import {
  Button as AriaButton,
  Input as AriaInput,
  ComboBox,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { initials } from "@/utils/string";
import { addStrikesAction } from "../_actions/add-strike";
import { addStrikesSchema, StrikeType, StrikeTypeCount, StrikeTypeLabels } from "../_lib/schema";

type User = {
  id: string;
  name: string;
  imageUrl: string | null;
  isBanned: boolean;
  strikes: number;
};

type StrikeButton = {
  users: Array<User>;
};

export const NewStrikesForm = ({ users }: StrikeButton) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof addStrikesSchema>>({
    resolver: zodResolver(addStrikesSchema),
    defaultValues: {
      userId: "",
      strikeType: StrikeType.DeregisterBeforeDeadline,
      count: 1,
      reason: "",
      banExpiresInMonths: 3,
      strikeExpiresInMonths: 10,
    },
  });

  const [user, setUser] = useState("");
  const watched = form.watch();

  const existingDots = users.find((user) => user.id === watched.userId)?.strikes ?? 0;
  const newDots =
    Number(existingDots) +
    (watched.strikeType === StrikeType.Other
      ? Number(watched.count)
      : Number(StrikeTypeCount[watched.strikeType]));
  const shouldBeBanned = newDots >= 5;

  const reset = () => {
    setUser("");
    form.reset({
      count: 1,
      banExpiresInMonths: 3,
      strikeExpiresInMonths: 10,
      reason: "",
      userId: "",
    });
    form.clearErrors();
  };

  const onSubmit = form.handleSubmit(
    async (data) => {
      const { success, message } = await addStrikesAction(data);
      if (!success) {
        toast({
          title: message,
          variant: "destructive",
        });
        return;
      }

      router.refresh();
      reset();
      toast({
        title: message,
        variant: "success",
      });
    },
    (error) => {
      console.error(error);
    },
  );

  // SUPER HACKY !
  useEffect(() => {
    if (shouldBeBanned) {
      form.setValue("strikeExpiresInMonths", 10);
    } else {
      form.setValue("strikeExpiresInMonths", 10);
    }

    if (!shouldBeBanned) {
      form.setValue("banExpiresInMonths", 3);
    } else {
      form.setValue("banExpiresInMonths", 3);
    }
  }, [form, shouldBeBanned]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="max-w-screen-sm space-y-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="user">Bruker</FormLabel>
              <FormControl>
                <UserSearch
                  value={user}
                  onInputChange={setUser}
                  onChange={(data) => {
                    field.onChange(data);
                    form.reset({
                      count: 1,
                      strikeExpiresInMonths: 10,
                      banExpiresInMonths: 3,
                      strikeType: StrikeType.DeregisterBeforeDeadline,
                      reason: "",
                      userId: data,
                    });
                  }}
                  users={users}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="strikeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="strikeType">Årsak</FormLabel>
              <FormControl>
                <Select {...field}>
                  {Object.entries(StrikeTypeLabels).map(([key, value]) => {
                    const dots = StrikeTypeCount[key];
                    const dotsText = dots ? ` (${dots} prikk${dots > 1 ? "er" : ""})` : "";
                    return (
                      <option key={key} value={key}>
                        {value} {dotsText}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormDescription>
                Hvorfor skal brukeren få prikker? Det du skriver her er også synlig for brukeren.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {watched.strikeType === "other" && (
          <>
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="reason">Årsak</FormLabel>
                  <FormControl>
                    <Textarea
                      id="reason"
                      placeholder="Hvorfor skal brukeren prikk(er)?"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Hvorfor skal brukeren få prikker? Det du skriver her er også synlig for
                    brukeren.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="count">Antall prikker</FormLabel>
                  <FormControl>
                    <Select
                      id="count"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <option value={1}>1 prikker</option>
                      <option value={2}>2 prikker</option>
                      <option value={3}>3 prikker</option>
                      <option value={4}>4 prikker</option>
                      <option value={5}>5 prikker</option>
                    </Select>
                  </FormControl>
                  {shouldBeBanned ? (
                    <FormDescription className="text-red-500">
                      Brukeren vil bli bannet etter denne prikken
                    </FormDescription>
                  ) : (
                    <FormDescription>{newDots} prikk(er) totalt for brukeren</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          key="strikeExpiresInMonths"
          name="strikeExpiresInMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="strikeExpires">Prikk(er) utløper om</FormLabel>
              <FormControl>
                <Select
                  id="strikeExpires"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <option value={1}>1 måned</option>
                  <option value={2}>2 måneder</option>
                  <option value={3}>3 måneder</option>
                  <option value={4}>4 måneder</option>
                  <option value={5}>5 måneder</option>
                  <option value={6}>6 måneder</option>
                  <option value={7}>7 måneder</option>
                  <option value={8}>8 måneder</option>
                  <option value={9}>9 måneder</option>
                  <option value={10}>10 måneder</option>
                </Select>
              </FormControl>
              <FormDescription>
                Hvor lenge prikkene skal vare for brukeren. 10 måneder er standard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {shouldBeBanned && (
          <FormField
            control={form.control}
            key="banExpiresInMonths"
            name="banExpiresInMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="banExpires">Ban utløper om</FormLabel>
                <FormControl>
                  <Select
                    id="banExpires"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <option value={1}>1 måned</option>
                    <option value={2}>2 måneder</option>
                    <option value={3}>3 måneder</option>
                    <option value={4}>4 måneder</option>
                    <option value={5}>5 måneder</option>
                    <option value={6}>6 måneder</option>
                    <option value={7}>7 måneder</option>
                    <option value={8}>8 måneder</option>
                    <option value={9}>9 måneder</option>
                    <option value={10}>10 måneder</option>
                  </Select>
                </FormControl>
                <FormDescription>
                  Hvor lenge brukeren skal være bannet. 3 måneder er standard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button size="sm" type="submit">
          Gi prikk
        </Button>
      </form>
    </Form>
  );
};

type UserSearchProps = {
  users: Array<User>;
  onChange?: (data: string) => void;
  value?: string;
  onInputChange?: (data: string) => void;
};

const UserSearch = ({ users, value, onInputChange, onChange }: UserSearchProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inputWidth, setInputWidth] = useState(300);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setInputWidth(ref.current.offsetWidth);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ComboBox
      aria-label="user"
      name="user"
      formValue="key"
      inputValue={value}
      onInputChange={onInputChange}
      onSelectionChange={(data) => onChange?.(data?.toString() ?? "")}
    >
      <div
        ref={ref}
        className="group relative flex h-10 w-full rounded-md border-2 border-border bg-input text-sm font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <AriaInput
          placeholder="Velg en bruker..."
          className="h-full w-full border-0 bg-transparent px-3 py-2 outline-0 ring-0 placeholder:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
        />
        <AriaButton className="absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
          <ChevronDown className="h-4 w-4" />
        </AriaButton>
      </div>
      <Popover
        style={{
          minWidth: "280px",
          width: inputWidth,
          maxWidth: "640px",
        }}
      >
        <ListBox
          items={users}
          className="flex max-h-96 w-full flex-col overflow-y-scroll rounded-md border-2 border-border bg-input px-3 py-2 text-foreground"
        >
          {(user) => {
            return (
              <ListBoxItem
                className="group flex cursor-default select-none items-center gap-2 rounded border-2 border-transparent py-2 pl-2 pr-4 text-gray-900 outline-none focus:border-border focus:bg-muted selected:border-border selected:bg-muted"
                key={user.id}
                textValue={user.name}
              >
                {() => {
                  return (
                    <>
                      <Avatar className="size-12 md:size-14">
                        <AvatarImage src={user.imageUrl ?? ""} />
                        <AvatarFallback className="bg-background text-foreground">
                          {initials(user.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{user.name}</span>
                        {user.isBanned ? (
                          <span className="text-red-500">Bannet</span>
                        ) : (
                          <span className="text-muted-foreground">{user.strikes} prikk(er)</span>
                        )}
                      </div>
                    </>
                  );
                }}
              </ListBoxItem>
            );
          }}
        </ListBox>
      </Popover>
    </ComboBox>
  );
};
