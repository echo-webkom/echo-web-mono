import {type GetServerSideProps} from "next";

import {isErrorMessage} from "@/utils/error";
import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import Layout from "@/components/layout";
import Markdown from "@/components/markdown";
import {fetchEventBySlug, type Event} from "@/api/event";

interface Props {
  event: Event;
}

const EventPage = ({event}: Props) => {
  return (
    <Layout>
      <Container>
        <Breadcrumbs>
          <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
          <Breadcrumbs.Item to="/">Arrangementer</Breadcrumbs.Item>
          <Breadcrumbs.Item>{event.title}</Breadcrumbs.Item>
        </Breadcrumbs>

        <article className="prose md:prose-xl">
          <h1>{event.title}</h1>
          <Markdown content={event.body?.no ?? ""} />
        </article>
      </Container>
    </Layout>
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
