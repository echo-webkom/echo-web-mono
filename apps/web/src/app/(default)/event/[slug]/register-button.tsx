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
import {useRegistration} from "@/hooks/use-registration";
import {toast} from "@/hooks/use-toast";
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
  const {register, isLoading} = useRegistration(slug, {
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
      toast({
        title: "Påmelding fullført",
        description: "Du er nå påmeldt til arrangementet",
      });
    },
    onError: () => {
      setIsOpen(false);
      toast({
        title: "Noe gikk galt",
        description: "Kunne ikke melde deg på arrangementet",
      });
    },
  });

  const methods = useForm<RegistrationForm>({
    defaultValues: {
      questions: questions.map((question) => ({
        question: question.title,
      })),
    },
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    await register({
      questions: data.questions,
    });
  });

  const handleReset = () => {
    methods.reset();
  };

  if (questions.length === 0) {
    return (
      <Button
        onClick={() => {
          void register({
            questions: [],
          });
        }}
        disabled={isLoading}
        fullWidth
      >
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
