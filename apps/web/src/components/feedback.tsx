import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {Tooltip} from "@radix-ui/react-tooltip";
import {useForm} from "react-hook-form";
import {MdOutlineFeedback} from "react-icons/md";
import {z} from "zod";

import {api} from "@/utils/api";
import {Button} from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Input from "./ui/input";
import Label from "./ui/label";
import Textarea from "./ui/textarea";
import {TooltipContent, TooltipProvider, TooltipTrigger} from "./ui/tooltip";

const feedbackSchema = z.object({
  email: z.string().email().or(z.literal("")).optional(),
  name: z.string().max(100).optional(),
  message: z.string().min(5).max(500),
});
type FormValues = z.infer<typeof feedbackSchema>;

const Feedback = () => {
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(feedbackSchema),
  });

  const feedbackMutation = api.feedback.create.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      methods.reset();
      alert("Takk for tilbakemeldingen!");
    },
    onError: () => {
      alert("Noe gikk galt, prøv igjen senere.");
    },
  });

  const onSubmit = methods.handleSubmit(
    (data) => {
      feedbackMutation.mutate({
        email: data.email?.length ? data.email : undefined,
        name: data.name?.length ? data.name : undefined,
        message: data.message,
      });
    },
    (error) => {
      console.error(error);
    },
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-0 right-0 z-30 m-5 h-12 w-12 rounded-full bg-primary shadow-md focus:ring focus:ring-primary focus:ring-offset-2"
              >
                <MdOutlineFeedback className="mx-auto mt-auto h-6 w-6 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send tilbakemelding</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send inn tilbakemelding</DialogTitle>
          <DialogDescription>
            Din tilbakemelding betyr mye for oss. Gjerne fortell oss hva du ønsker å se på nettsiden
            eller hva vi kan gjøre bedre. Alternativt kan du også opprette en issue på GitHub for å
            rapportere en feil.
          </DialogDescription>
        </DialogHeader>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={onSubmit} onReset={() => methods.reset()}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                {...methods.register("email")}
                id="email"
                name="email"
                type="email"
                placeholder="Din e-post"
              />
              {methods.formState.errors.email?.message && (
                <p className="text-xs italic text-red-500">
                  {methods.formState.errors.email?.message.toString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Navn</Label>
              <Input
                {...methods.register("name")}
                id="name"
                name="name"
                type="text"
                placeholder="Ditt navn"
              />
              {methods.formState.errors.name?.message && (
                <p className="text-xs italic text-red-500">
                  {methods.formState.errors.name?.message.toString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Tilbakemelding</Label>
              <Textarea
                {...methods.register("message")}
                id="message"
                name="message"
                placeholder="Din tilbakemelding"
              />
              {methods.formState.errors.message?.message && (
                <p className="text-xs italic text-red-500">
                  {methods.formState.errors.message?.message.toString()}
                </p>
              )}
            </div>
          </div>
          <small>
            Feltene for navn og e-post er ikke påkrevd, men fylles ut dersom du tillater at vi
            kontakter deg om tilbakemeldingen.
          </small>
          <DialogFooter className="mt-3 flex flex-col gap-2">
            <Button
              className="w-full sm:w-auto"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Avbryt
            </Button>
            <Button className="w-full sm:w-auto" type="submit">
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Feedback;
