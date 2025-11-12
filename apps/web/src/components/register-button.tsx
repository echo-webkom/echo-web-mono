"use client";

import { Activity, useEffect, useEffectEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { type z } from "zod";

import { type Question } from "@echo-webkom/db/schemas";

import { register } from "@/actions/register";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { registrationFormSchema } from "@/lib/schemas/registration";
import { Countdown } from "./countdown";
import { Checkbox } from "./ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";

type RegisterButtonProps = {
  id: string;
  userRegistrationStart: Date;
  questions: Array<Question>;
  buttonText?: string;
};

export const RegisterButton = ({
  id,
  userRegistrationStart,
  questions,
  buttonText = "Meld på",
}: RegisterButtonProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: standardSchemaResolver(registrationFormSchema),
    defaultValues: {
      questions: questions.map((question) => ({
        questionId: question.id,
        answer: question.type === "checkbox" ? [] : undefined,
      })),
    },
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    return new Date(userRegistrationStart).getTime() - Date.now();
  });

  const canSubmit = timeLeft < 0;

  const onTick = useEffectEvent(() => {
    if (timeLeft < 0) return;
    setTimeLeft(new Date(userRegistrationStart).getTime() - Date.now());
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      onTick();
    }, 1);

    return () => clearInterval(intervalId);
  }, []);

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    const { success, message } = await register(id, {
      questions: data.questions.map((question) => ({
        ...question,
        answer: question.answer ?? "",
      })),
    });

    setIsLoading(false);
    if (success) {
      setIsOpen(false);
      form.reset();
      router.refresh();
    }

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });
  });

  const handleOneClickRegister = async () => {
    setIsLoading(true);

    const { success, message } = await register(id, { questions: [] });

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    setIsLoading(false);
    if (success) {
      router.refresh();
    }
  };

  if (questions?.length === 0) {
    return (
      <Button onClick={handleOneClickRegister} fullWidth>
        {isLoading ? (
          <>
            <span>
              <AiOutlineLoading className="h-4 w-4 animate-spin" />
            </span>
            <span className="ml-2">Vroom...</span>
          </>
        ) : (
          <DialogFooter>
            <Activity mode={canSubmit ? "visible" : "hidden"}>One-click påmelding</Activity>
            <Activity mode={canSubmit ? "hidden" : "visible"}>
              <Countdown toDate={userRegistrationStart} />
            </Activity>
          </DialogFooter>
        )}
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} fullWidth disabled={isLoading}>
          {isLoading ? (
            <>
              <span>
                <AiOutlineLoading className="h-4 w-4 animate-spin" />
              </span>
              <span className="ml-2">Melder på...</span>
            </>
          ) : (
            <span>{buttonText}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Tilleggsspørsmål</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={`questions.${index}.answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required={question.required}>{question.title}</FormLabel>
                        {question.type === "text" && (
                          <FormControl>
                            <Input
                              placeholder="Ditt svar..."
                              autoComplete="off"
                              {...field}
                              value={field.value ?? ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        )}

                        {question.type === "radio" && (
                          <FormControl>
                            <Select {...field}>
                              <option hidden>Velg...</option>
                              {question?.options?.map((option) => (
                                <option key={option.id} value={option.value}>
                                  {option.value}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                        )}

                        {question.type === "textarea" && (
                          <FormControl>
                            <Textarea
                              placeholder="Ditt svar..."
                              {...field}
                              value={field.value ?? ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        )}

                        {question.type === "checkbox" &&
                          question.options?.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name={`questions.${index}.answer`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value as Array<string>),
                                              option.id,
                                            ])
                                          : field.onChange(
                                              (field.value as Array<string>).filter(
                                                (value) => value !== option.id,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel>{option.value}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </DialogBody>
            <DialogFooter>
              <Activity mode={canSubmit ? "visible" : "hidden"}>
                <Button size="sm" type="submit">
                  Send inn
                </Button>
              </Activity>
              <Activity mode={canSubmit ? "hidden" : "visible"}>
                <Countdown toDate={userRegistrationStart} />
              </Activity>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
