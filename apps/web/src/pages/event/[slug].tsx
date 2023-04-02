import {type GetServerSideProps} from "next";
import {fetchEventBySlug, type Event} from "@/api/events";
import Breadcrumbs from "@/components/breadcrumbs";
import Button from "@/components/button";
import Container from "@/components/container";
import Layout from "@/components/layout";
import Markdown from "@/components/markdown";

interface Props {
  event: Event;
}

const EventPage = ({event}: Props) => {
  return (
    <Layout>
      <Container>
        <Breadcrumbs>
          <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
          <Breadcrumbs.Item to="/events">Arrangementer</Breadcrumbs.Item>
          <Breadcrumbs.Item>{event.title}</Breadcrumbs.Item>
        </Breadcrumbs>

        <div className="sticky top-14 mb-5 flex flex-col gap-3 border-b border-t bg-white py-3">
          <div className="flex w-full items-center">
            <div>
              <p>
                <span className="font-bold">Påmeldte:</span> 30/80
              </p>
            </div>
            <div className="flex-grow" />
            <div>
              <Button>Meld deg på</Button>
            </div>
          </div>
        </div>

        <article className="prose md:prose-xl">
          <h1>{event.title}</h1>
          <Markdown content={event.body.no} />
        </article>
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const event = await fetchEventBySlug(slug);

  if (!event) {
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
