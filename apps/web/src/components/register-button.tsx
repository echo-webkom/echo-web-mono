"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { Controller, useForm } from "react-hook-form";
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

type RegisterButtonProps = {
  id: string;
  questions: Array<Question>;
};

export function RegisterButton({ id, questions }: RegisterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      questions: questions.map((question) => ({
        questionId: question.id,
        answer: undefined,
      })),
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    const { success, message } = await register(id, {
      questions: data.questions,
    });

    setIsLoading(false);

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    router.refresh();
  });

  const handleOneClickRegister = async () => {
    setIsLoading(true);

    const { success, message } = await register(id, { questions: [] });

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    setIsLoading(false);

    router.refresh();
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
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Tilleggsspørsmål</DialogTitle>
            <DialogDescription>Svar for å kunne melde deg på.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {questions.map((question, index) => (
              <div key={question.id} className="flex flex-col gap-2">
                <Label>
                  {question.title}
                  {question.required && <span className="ml-1 text-red-500">*</span>}
                </Label>

                {question.type === "text" && (
                  <Controller
                    name={`questions.${index}.answer`}
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        placeholder="Ditt svar..."
                        autoComplete="off"
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}

                {question.type === "radio" && (
                  <Controller
                    name={`questions.${index}.answer`}
                    control={form.control}
                    render={({ field }) => (
                      <Select {...field}>
                        <option hidden>Velg...</option>
                        {question?.options?.map((option) => (
                          <option key={option.id} value={option.value}>
                            {option.value}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                )}

                {form.formState.errors.questions?.[index]?.answer && (
                  <p className="text-red-500">
                    {form.formState.errors.questions?.[index]?.answer?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">Send inn</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
