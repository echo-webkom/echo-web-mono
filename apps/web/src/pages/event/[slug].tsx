import {GetServerSideProps} from "next";
import Link from "next/link";
import {fetchEventBySlug} from "@/api";
import {Button, Layout, Markdown} from "@/components";

interface Props {
  event: Awaited<ReturnType<typeof fetchEventBySlug>>;
}

const EventPage = ({event}: Props) => {
  if (!event) {
    return <div>404</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-3">
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

        {/* Breadcrums */}
        <div>
          <Link className="hover:underline" href="/">
            Hjem
          </Link>{" "}
          {">"}{" "}
          <Link className="hover:underline" href="/">
            Bedriftspresentasjoner
          </Link>{" "}
          {">"} <span className="underline">{event.title}</span>
        </div>

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
