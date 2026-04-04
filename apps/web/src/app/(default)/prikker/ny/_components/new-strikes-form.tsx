"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { createProfilePictureUrl } from "@/api/client";
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
import { UserSearchSelect } from "@/components/user-search-select";
import { initials } from "@/utils/string";

import { addStrikesAction } from "../_actions/add-strike";
import { addStrikesSchema, StrikeType, StrikeTypeCount, StrikeTypeLabels } from "../_lib/schema";

type User = {
  id: string;
  name: string;
  hasImage: boolean;
  isBanned: boolean;
  strikes: number;
};

type StrikeButton = {
  users: Array<User>;
};

export const NewStrikesForm = ({ users }: StrikeButton) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof addStrikesSchema>>({
    resolver: standardSchemaResolver(addStrikesSchema),
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
  // eslint-disable-next-line react-hooks/incompatible-library
  const watched = form.watch();

  const existingDots = users.find((user) => user.id === watched.userId)?.strikes ?? 0;
  const usersById = useMemo(() => {
    return new Map(users.map((user) => [user.id, user]));
  }, [users]);

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
        toast.error(message);
        return;
      }

      router.refresh();
      reset();
      toast.success(message);
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
      <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="user">Bruker</FormLabel>
              <FormControl>
                <UserSearchSelect
                  value={user}
                  onInputChangeAction={(data) => {
                    setUser(data);
                    field.onChange("");
                  }}
                  onSelectAction={(selectedUser) => {
                    const detailedUser = usersById.get(selectedUser.id);
                    setUser(detailedUser?.name ?? selectedUser.name);
                    field.onChange(selectedUser.id);
                    form.reset({
                      count: 1,
                      strikeExpiresInMonths: 10,
                      banExpiresInMonths: 3,
                      strikeType: StrikeType.DeregisterBeforeDeadline,
                      reason: "",
                      userId: selectedUser.id,
                    });
                  }}
                  placeholder="Velg en bruker..."
                  renderOptionAction={(candidate) => {
                    const detailedUser = usersById.get(candidate.id);
                    const userData = detailedUser ?? {
                      id: candidate.id,
                      name: candidate.name,
                      hasImage: false,
                      isBanned: false,
                      strikes: 0,
                    };
                    const imageUrl = userData.hasImage
                      ? createProfilePictureUrl(userData.id)
                      : undefined;

                    return (
                      <>
                        <Avatar className="size-12 md:size-14">
                          <AvatarImage src={imageUrl} />
                          <AvatarFallback className="bg-background text-foreground">
                            {initials(userData.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          <span className="text-foreground font-semibold">{userData.name}</span>
                          {userData.isBanned ? (
                            <span className="text-red-500">Bannet</span>
                          ) : (
                            <span className="text-muted-foreground">
                              {userData.strikes} prikk(er)
                            </span>
                          )}
                        </div>
                      </>
                    );
                  }}
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
