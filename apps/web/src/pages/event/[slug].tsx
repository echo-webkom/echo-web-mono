import {fetchEventBySlug} from "@/api";
import {Layout, Markdown} from "@/components";
import {GetServerSideProps} from "next";

interface Props {
  event: Awaited<ReturnType<typeof fetchEventBySlug>>;
}

const EventPage = ({event}: Props) => {
  if (!event) {
    return <div>404</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto">
        <h1>{event.title}</h1>
        <Markdown content={event.body.no} />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const event = await fetchEventBySlug(slug);

  return {
    props: {
      event,
    },
  };
};

export default EventPage;
