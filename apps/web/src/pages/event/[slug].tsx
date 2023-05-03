import {type GetServerSideProps} from "next";
import Head from "next/head";

import {fetchEventBySlug, type Event} from "@/api/event";
import Container from "@/components/container";
import HappeningSidebar from "@/components/happening-sidebar";
import Markdown from "@/components/markdown";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import DefaultLayout from "@/layouts/default";
import {isErrorMessage} from "@/utils/error";

type Props = {
  event: Event;
};

const EventPage = ({event}: Props) => {
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
            <HappeningSidebar slug={event.slug} />
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
