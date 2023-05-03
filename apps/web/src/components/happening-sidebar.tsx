import {Controller, useForm} from "react-hook-form";
import {AiOutlineLoading} from "react-icons/ai";

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
import Label from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useToast} from "@/hooks/use-toast";
import {api} from "@/utils/api";
import {cn} from "@/utils/cn";
import {norwegianDateString, shortDate} from "@/utils/date";
import {isErrorMessage} from "@/utils/error";

type HappeningSidebarProps = {
  slug: string;
};

type RegisterForm = Record<string, string>;

type DeregisterForm = {
  reason: string;
};

const HappeningSidebar = ({slug}: HappeningSidebarProps) => {
  const {toast} = useToast();

  const registerMethods = useForm<RegisterForm>();
  const deregisterMethods = useForm<DeregisterForm>();

  const onRegisterSubmit = registerMethods.handleSubmit(
    () => {
      registerMutation.mutate({
        slug,
      });
      registerMethods.reset();
    },
    () => {
      toast({
        variant: "destructive",
        title: "Noe gikk galt",
        description: "Har du husket å fylle ut alle feltene?",
        duration: 3000,
      });
    },
  );

  const onDeregisterSubmit = deregisterMethods.handleSubmit(
    (data) => {
      deregisterMutation.mutate({
        slug,
        reason: data.reason,
      });
      deregisterMethods.reset();
    },
    () => {
      toast({
        variant: "destructive",
        title: "Noe gikk galt",
        description: "Har du husket å fylle ut alle feltene?",
        duration: 3000,
      });
    },
  );

  const eventInfo = api.happening.get.useQuery({
    slug,
  });

  const registerMutation = api.happening.register.useMutation({
    onSuccess: () => {
      void eventInfo.refetch();
      toast({
        title: "Påmelding vellykket!",
        variant: "success",
        duration: 3000,
      });
    },
    onError: (err) => {
      if (isErrorMessage(err)) {
        toast({
          title: "Noe gikk galt",
          description: "Kontakt Webkom hvis problemet vedvarer",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const deregisterMutation = api.happening.deregister.useMutation({
    onSuccess: () => {
      void eventInfo.refetch();
      toast({
        title: "Avmelding vellykket!",
        variant: "success",
        duration: 3000,
      });
    },
    onError: (err) => {
      if (isErrorMessage(err)) {
        toast({
          title: "Noe gikk galt",
          description: "Kontakt Webkom hvis problemet vedvarer",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const handleRegister = () => {
    registerMutation.mutate(
      {slug},
      {
        onSuccess: () => {
          toast({
            title: "Påmelding vellykket!",
            variant: "success",
            duration: 3000,
          });
        },
        onError: (_err) => {
          toast({
            title: "Noe gikk galt",
            variant: "destructive",
            duration: 3000,
          });
        },
      },
    );
  };

  if (eventInfo.isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded border">
        <AiOutlineLoading className="animate-spin text-4xl" />
      </div>
    );
  }

  return (
    <div className="h-fit rounded border p-5 md:sticky md:top-32">
      {eventInfo.data?.date && (
        <div>
          <h2 className="text-lg font-bold">Dato</h2>
          <p className="text-sm">{norwegianDateString(new Date(eventInfo.data?.date))}</p>
        </div>
      )}
      {eventInfo.data?.totalSpots && (
        <div>
          <h2 className="text-lg font-bold">Plasser</h2>
          {eventInfo.data?.registeredCount ? (
            <p className="text-sm">
              {eventInfo.data?.registeredCount} / {eventInfo.data?.totalSpots}
            </p>
          ) : (
            <p className="text-sm">{eventInfo.data?.totalSpots}</p>
          )}
        </div>
      )}
      {eventInfo.data?.waitlistedCount && (
        <div>
          <h2 className="text-lg font-bold">På venteliste</h2>
          <p className="text-sm">{eventInfo.data?.waitlistedCount}</p>
        </div>
      )}
      {eventInfo.data?.registrationStart &&
        new Date() < new Date(eventInfo.data.registrationStart) && (
          <div>
            <h2 className="text-lg font-bold">Påmelding åpner</h2>
            <p className="text-sm">{shortDate(new Date(eventInfo.data?.registrationStart))}</p>
          </div>
        )}
      {eventInfo.data?.registrationEnd && new Date() < new Date(eventInfo.data.registrationEnd) && (
        <div>
          <h2 className="text-lg font-bold">Påmelding stenger</h2>
          <p className="text-sm">{shortDate(new Date(eventInfo.data?.registrationEnd))}</p>
        </div>
      )}
      <div className="mt-5">
        {eventInfo.data?.registrationEnd && eventInfo.data?.registrationEnd < new Date() && (
          <Button disabled fullWidth>
            Fristen er ute
          </Button>
        )}
        {eventInfo.data?.isAlreadyRegistered && (
          <Dialog>
            <DialogTrigger asChild>
              <Button fullWidth>Meld deg av</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <form onSubmit={onDeregisterSubmit}>
                <DialogHeader>
                  <DialogTitle>Meld deg av</DialogTitle>
                  <DialogDescription>
                    Hvorfor melder du deg av? Du må gi en begrunnelse.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    className={cn({
                      "ring-1 ring-red-400":
                        // TODO: fiks ring
                        !!deregisterMethods.formState.errors.reason?.message,
                    })}
                    {...deregisterMethods.register("reason", {required: true})}
                    type="text"
                  />
                  <p className="text-xs text-slate-500">Prikker kan medfølge.</p>
                </div>
                <DialogFooter>
                  <Button type="submit">Send inn</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
        {!eventInfo.data?.isAlreadyRegistered &&
          eventInfo.data?.registrationEnd &&
          eventInfo.data?.registrationEnd >= new Date() && (
            <>
              {eventInfo.data?.questions.length === 0 ? (
                // TODO: turbo spinner !!!
                <Button fullWidth onClick={handleRegister}>
                  Meld deg på
                </Button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button fullWidth>
                      {eventInfo.data?.isAlreadyRegistered ? "Meld deg av" : "Meld deg på"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <form onSubmit={onRegisterSubmit}>
                      <DialogHeader>
                        <DialogTitle>Tilleggsspørsmål</DialogTitle>
                        <DialogDescription>Svar for å kunne melde deg på.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {eventInfo.data?.questions.map((question) => (
                          <div key={question.id}>
                            <Label>{question.title}</Label>
                            {question.type === "CHOICE" ? (
                              <Controller
                                name={question.title}
                                control={registerMethods.control}
                                rules={{required: question.required}}
                                render={({field}) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder={question.title} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {!question.required && (
                                        <SelectItem value="Ingen">Ingen</SelectItem>
                                      )}
                                      {question.options.map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            ) : (
                              <Input
                                {...registerMethods.register(question.title, {
                                  required: question.required,
                                })}
                                type="text"
                              />
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
              )}
            </>
          )}
      </div>
    </div>
  );
};

export default HappeningSidebar;
