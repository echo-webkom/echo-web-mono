import Head from "next/head";
import {type GetStaticProps} from "next/types";
import {fetchComingEventPreviews, type EventPreview} from "@/api/events";
import Container from "@/components/container";
import EventPreviewBox from "@/components/event-preview";
import Layout from "@/components/layout";

type Props = {
  bedpresPreviews: Array<EventPreview>;
  eventPreviews: Array<EventPreview>;
};

const EventPage = ({bedpresPreviews, eventPreviews}: Props) => {
  return (
    <>
      <Head>
        <title>Event</title>
      </Head>

      <Layout>
        <Container>
          <h1 className="text-3xl font-bold">Event</h1>

          {bedpresPreviews.length > 0 && (
            <>
              <h2 className="text-2xl font-bold">Bedpres</h2>
              <ul>
                {bedpresPreviews.map((bedpres) => (
                  <li key={bedpres._id}>
                    <EventPreviewBox event={bedpres} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {eventPreviews.length > 0 && (
            <>
              <h2 className="text-2xl font-bold">Event</h2>
              <ul>
                {eventPreviews.map((event) => (
                  <li key={event._id}>
                    <EventPreviewBox event={event} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [bedpresPreviews, eventPreviews] = await Promise.all([
    fetchComingEventPreviews("BEDPRES", 0),
    fetchComingEventPreviews("EVENT", 0),
  ]);

  return {
    props: {
      bedpresPreviews,
      eventPreviews,
    },
  };
};

export default EventPage;
