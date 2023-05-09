"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Label} from "@radix-ui/react-label";
import {Controller, useForm} from "react-hook-form";
import {AiOutlineLoading} from "react-icons/ai";

import {type Question} from "@echo-webkom/db/types";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {type RegistrationForm} from "@/lib/schemas/registration";

export default function RegisterButton({
  slug,
  questions,
}: {
  slug: string;
  questions: Array<Question>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const methods = useForm<RegistrationForm>({
    defaultValues: {
      questions: questions.map((question) => ({
        question: question.title,
      })),
    },
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    const response = await fetch(`/api/happening/${slug}/register`, {
      method: "POST",
      body: JSON.stringify({
        questions: data.questions ?? [],
      }),
    });

    if (!response.ok) {
      return;
    }

    setIsOpen(false);

    methods.reset();
    router.refresh();
  });

  const handleReset = () => {
    methods.reset();
  };

  if (questions.length === 0) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      <form onSubmit={onSubmit}>
        <Button fullWidth>
          {methods.formState.isLoading ? (
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
      </form>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} fullWidth>
          {methods.formState.isLoading ? (
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
              <div key={question.id}>
                <Label>{question.title}</Label>

                {question.type === "TEXT" && (
                  <Input
                    placeholder="Ditt svar..."
                    {...methods.register(`questions.${index}.answer`)}
                  />
                )}

                {question.type === "CHOICE" && (
                  <Controller
                    name={`questions.${index}.answer`}
                    control={methods.control}
                    render={({field}) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Velg her..." />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options.map((option, optionIndex) => (
                            <SelectItem key={optionIndex} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="link" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit">Send inn</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
