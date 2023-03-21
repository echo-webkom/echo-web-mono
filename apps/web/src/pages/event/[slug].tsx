import {type GetServerSideProps} from "next";
import {fetchEventBySlug, type Event} from "@/api/events";
import {Breadcrum} from "@/components/breadcrums";
import {Button} from "@/components/button";
import {Layout} from "@/components/layout";
import {Markdown} from "@/components/markdown";

interface Props {
  event: Event;
}

const EventPage = ({event}: Props) => {
  return (
    <Layout>
      <div className="container mx-auto flex flex-col gap-5 px-3">
        <Breadcrum
          links={[
            {href: "/", label: "Hjem"},
            {href: "/events", label: "Arrangementer"},
            {href: `/events/${event.slug}`, label: event.title},
          ]}
        />

        <div className="mb-5 flex flex-col gap-3 border-b border-t py-3">
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

        <Markdown content={event.body.no} />
      </div>
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
