import {type GetServerSideProps} from "next";
import Head from "next/head";

import {fetchEventBySlug, type Event} from "@/api/event";
import Container from "@/components/container";
import Markdown from "@/components/markdown";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import {Button} from "@/components/ui/button";
import Layout from "@/layouts/layout";
import {api} from "@/utils/api";
import {norwegianDateString} from "@/utils/date";
import {isErrorMessage} from "@/utils/error";

type Props = {
  event: Event;
};

const EventPage = ({event}: Props) => {
  const eventInfo = api.happening.get.useQuery({
    slug: event.slug,
  });

  const registerMutation = api.happening.register.useMutation({
    onSuccess: () => {
      void eventInfo.refetch();
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

  const handleDeregister = () => {
    deregisterMutation.mutate(
      {slug: event.slug},
      {
        onSuccess: () => {
          alert("Du er nå avmeldt arrangementet!");
        },
        onError: (err) => {
          alert(err);
        },
      },
    );
  };

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

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
            <div className="h-fit rounded border p-5">
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
                {eventInfo.data?.isAlreadyRegistered ? (
                  <Button onClick={handleDeregister} fullWidth>
                    Meld av
                  </Button>
                ) : (
                  <Button onClick={handleRegister} fullWidth>
                    Meld på
                  </Button>
                )}
              </div>
            </div>

            <article className="prose md:prose-xl lg:col-span-3">
              <h1>{event.title}</h1>
              <Markdown content={event.body?.no ?? ""} />
            </article>
          </div>
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
