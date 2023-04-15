import {useState} from "react";
import {type GetServerSideProps} from "next";
import Head from "next/head";
import {AlertDialogTitle} from "@radix-ui/react-alert-dialog";
import {Controller, useForm} from "react-hook-form";

import {fetchEventBySlug, type Event} from "@/api/event";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/alert-dialog";
import Breadcrumbs from "@/components/breadcrumbs";
import Button from "@/components/button";
import Container from "@/components/container";
import {Input} from "@/components/input";
import Layout from "@/components/layout";
import Markdown from "@/components/markdown";
import {RadioGroup, RadioGroupItem} from "@/components/radio-group";
import {isErrorMessage} from "@/utils/error";

type Props = {
  event: Event;
};

const EventPage = ({event}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm();

  const onSubmit = methods.handleSubmit((data) => {
    console.log(data);
    setIsOpen(false);
    methods.reset();
  });

  return (
    <>
      <Head>
        <title>echo | {event.title}</title>
      </Head>
      <Layout>
        <Container>
          <Breadcrumbs>
            <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
            <Breadcrumbs.Item to="/">Arrangementer</Breadcrumbs.Item>
            <Breadcrumbs.Item>{event.title}</Breadcrumbs.Item>
          </Breadcrumbs>

          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger className="rounded bg-echo-yellow2 px-3 py-2">
              Meld på
            </AlertDialogTrigger>
            <AlertDialogContent>
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <form onSubmit={onSubmit}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Fyll ut for å melde deg på</AlertDialogTitle>
                  {/* Description renders a p-tag */}
                  <AlertDialogDescription asChild>
                    <div className="flex flex-col gap-3">
                      {event.additionalQuestions?.map((question) => (
                        <div key={question.title} className="flex flex-col gap-2">
                          <h2>{question.title}</h2>

                          {question.type === "text" && (
                            <div className="flex flex-col gap-2">
                              <Input
                                {...methods.register(question.title, {required: question.required})}
                                type="text"
                                placeholder="Skriv her"
                              />
                              {methods.formState.errors[question.title]?.type === "required" && (
                                <p className="text-sm text-red-400">Dette feltet er er påkrevd</p>
                              )}
                            </div>
                          )}

                          {question.type === "multipleChoice" && (
                            <Controller
                              control={methods.control}
                              name={question.title}
                              rules={{
                                required: question.required,
                              }}
                              render={({field}) => (
                                <div className="flex flex-col gap-2">
                                  <RadioGroup
                                    value={field.value as string}
                                    onValueChange={field.onChange}
                                  >
                                    {question.options?.map((option) => (
                                      <div key={option} className="flex items-center gap-2">
                                        <RadioGroupItem id={option} value={option} />
                                        <label htmlFor={option}>{option}</label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                  {methods.formState.errors[question.title]?.type ===
                                    "required" && (
                                    <p className="text-sm text-red-400">
                                      Dette feltet er er påkrevd
                                    </p>
                                  )}
                                </div>
                              )}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button intent="secondary" onClick={() => setIsOpen(false)}>
                    Avbryt
                  </Button>
                  <Button type="submit">Send inn</Button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>

          <article className="prose md:prose-xl">
            <h1>{event.title}</h1>
            <Markdown content={event.body?.no ?? ""} />
          </article>
        </Container>
      </Layout>
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
