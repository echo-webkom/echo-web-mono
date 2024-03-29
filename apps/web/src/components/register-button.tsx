"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { type z } from "zod";

import { type Question } from "@echo-webkom/db/schemas";

import { register } from "@/actions/register";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { registrationFormSchema } from "@/lib/schemas/registration";
import { Checkbox } from "./ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";

type RegisterButtonProps = {
  id: string;
  questions: Array<Question>;
};

export function RegisterButton({ id, questions }: RegisterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      questions: questions.map((question) => ({
        questionId: question.id,
        answer: question.type === "checkbox" ? [] : undefined,
      })),
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    const { success, message } = await register(id, {
      questions: data.questions.map((question) => ({
        ...question,
        answer: question.answer ?? "",
      })),
    });

    setIsLoading(false);

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
  };

  if (questions.length === 0) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      <Button onClick={handleOneClickRegister} fullWidth>
        {isLoading ? (
          <>
            <span>
              <AiOutlineLoading className="h-4 w-4 animate-spin" />
            </span>
            <span className="ml-2">Vroom...</span>
          </>
        ) : (
          <span>One-click påmelding</span>
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
            <span>Meld på</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={onSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Tilleggsspørsmål</DialogTitle>
              <DialogDescription>Svar for å kunne melde deg på.</DialogDescription>
            </DialogHeader>
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
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
            <DialogFooter>
              <Button type="submit">Send inn</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
