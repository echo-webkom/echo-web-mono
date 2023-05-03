import {type GetServerSideProps} from "next";
import Head from "next/head";
import {Controller, useForm} from "react-hook-form";

import {fetchEventBySlug, type Event} from "@/api/event";
import Container from "@/components/container";
import Markdown from "@/components/markdown";
import Breadcrumbs from "@/components/ui/breadcrumbs";
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
import DefaultLayout from "@/layouts/default";
import {api} from "@/utils/api";
import {norwegianDateString} from "@/utils/date";
import {isErrorMessage} from "@/utils/error";

type Props = {
  event: Event;
};

type RegisterForm = Record<string, string>;

type DeregisterForm = {
  reason: string;
};

const EventPage = ({event}: Props) => {
  const registerMethods = useForm<RegisterForm>();
  const deregisterMethods = useForm<DeregisterForm>();

  const onRegisterSubmit = registerMethods.handleSubmit(
    (_data) => {
      registerMutation.mutate({
        slug: event.slug,
      });
      registerMethods.reset();
    },
    (err) => {
      // Handle errors
      alert(JSON.stringify({type: "error", data: err}));
    },
  );

  const onDeregisterSubmit = deregisterMethods.handleSubmit(
    (_data) => {
      deregisterMutation.mutate({
        slug: event.slug,
      });
      deregisterMethods.reset();
    },
    (err) => {
      // Handle errors
      alert(JSON.stringify({type: "error", data: err}));
    },
  );

  const eventInfo = api.happening.get.useQuery({
    slug: event.slug,
  });

  const registerMutation = api.happening.register.useMutation({
    onSuccess: () => {
      void eventInfo.refetch();
      // add toast
    },
  });

  const deregisterMutation = api.happening.deregister.useMutation({
    onSuccess: () => {
      void eventInfo.refetch();
    },
  });

  const handleRegister = () => {
    registerMutation.mutate(
      {slug: event.slug},
      {
        onSuccess: () => {
          alert("Du er nå påmeldt arrangementet!");
        },
        onError: (err) => {
          alert(err);
        },
      },
    );
  };

  if (eventInfo.isLoading) {
    // TODO: Skeleton event page
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Laster...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>echo | {event.title}</title>
      </Head>
      <DefaultLayout>
        <Container>
          <Breadcrumbs>
            <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
            <Breadcrumbs.Item to="/">Arrangementer</Breadcrumbs.Item>
            <Breadcrumbs.Item>{event.title}</Breadcrumbs.Item>
          </Breadcrumbs>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
            <div className="sticky top-32 h-fit rounded border p-5">
              <div>
                <h2 className="text-lg font-bold">Arrangement</h2>
                <p className="text-sm">{event.title}</p>
              </div>
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
              {eventInfo.data?.registrationStart && eventInfo.data.registrationEnd && (
                <div>
                  <h2 className="text-lg font-bold">Påmelding</h2>
                  <p className="text-sm">
                    {norwegianDateString(new Date(eventInfo.data?.registrationStart))} -{" "}
                    {norwegianDateString(new Date(eventInfo.data?.registrationEnd))}
                  </p>
                </div>
              )}
              <div className="mt-5">
                {eventInfo.data?.isAlreadyRegistered && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Meld deg av</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                      <form onSubmit={onDeregisterSubmit}>
                        <DialogHeader>
                          <DialogTitle>Meld deg av</DialogTitle>
                          <DialogDescription>
                            Hvorfor melder du deg av? Merk prikker kan medfølge.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <Input {...deregisterMethods.register("reason")} type="text" />
                        </div>
                        <DialogFooter>
                          <Button type="submit">Send inn</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
                {!eventInfo.data?.isAlreadyRegistered && (
                  <>
                    {eventInfo.data?.questions.length === 0 ? (
                      // TODO: turbo spinner !!!
                      <Button onClick={handleRegister}>Meld deg på</Button>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
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
                                      {...registerMethods.register(question.title)}
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

            <article className="prose md:prose-xl lg:col-span-3">
              <h1>{event.title}</h1>
              <Markdown content={event.body ?? ""} />
            </article>
          </div>
        </Container>
      </DefaultLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const event = await fetchEventBySlug(slug);

  if (isErrorMessage(event)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      event,
    },
  };
};

export default EventPage;
