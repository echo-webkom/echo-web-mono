import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {fetchEventPreviews} from "@/api/events";
import {fetchPosts} from "@/api/posts";
import {Button, Layout} from "@/components";
import {isErrorMessage} from "@/utils/error";
import removeMd from "remove-markdown";

interface Props {
  eventPreviews: Awaited<ReturnType<typeof fetchEventPreviews>>;
  bedpresPreviews: Awaited<ReturnType<typeof fetchEventPreviews>>;
  posts: Awaited<ReturnType<typeof fetchPosts>>;
}

const HomePage = ({eventPreviews, bedpresPreviews, posts}: Props) => {
  return (
    <>
      <Head>
        <title>echo - Linjeforeningen for informatikk</title>
      </Head>
      <Layout>
        {/* Welcome */}
        <div className="relative mt-10 mb-40 p-20">
          <Image src="/hero.jpg" alt="hero image" fill className="blur" />

          <div className="z-[1] mx-auto max-w-3xl">
            <div className="flex flex-col gap-10 py-10">
              <div className="z-[1] flex flex-col gap-3 text-center">
                <h2 className="text-3xl">Hei, og velkommen til</h2>
                <h2 className="text-4xl font-bold">echo - Linjeforeningen for informatikk</h2>
              </div>
              <div className="mx-auto flex w-full flex-col gap-8 md:flex-row">
                <Button intent="primary" size="large" fullWidth>
                  Arrangementer
                </Button>
                <Button intent="secondary" size="large" fullWidth>
                  For bedrifter
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="flex flex-col gap-20">
          <div className="container mx-auto px-3">
            <h2 className="mb-5 text-2xl font-bold">Kommende arrangementer</h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {eventPreviews.map((event) => (
                <Link
                  href={`/event/${event.slug}`}
                  key={event.slug}
                  className="flex h-auto flex-col gap-3 rounded-md border border-gray-200 p-5 hover:ring focus:ring"
                >
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <hr />
                    <p className="text-gray-500">{removeMd(event.body.no)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="container mx-auto px-3">
            <h2 className="mb-5 text-2xl font-bold">Kommende bedriftspresentasjoner</h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {bedpresPreviews.map((event) => (
                <Link
                  href={`/event/${event.slug}`}
                  key={event.slug}
                  className="flex h-auto flex-col gap-3 rounded-md border border-gray-200 p-5 hover:ring focus:ring"
                >
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <hr />
                    <p className="text-gray-500">{removeMd(event.body.no)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="container mx-auto px-3">
            <h2 className="mb-5 text-2xl font-bold">Siste innlegg</h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {isErrorMessage(posts) && <p>Kunne ikke hente innlegg</p>}
              {!isErrorMessage(posts) &&
                posts.map((post) => (
                  <Link
                    href={`/post/${post.slug}`}
                    key={post.slug}
                    className="flex h-auto flex-col gap-3 rounded-md border border-gray-200 p-5 hover:ring focus:ring"
                  >
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-bold">{post.title.no}</h3>
                      <hr />
                      <p className="text-gray-500">{removeMd(post.body.no).slice(0, 250)}...</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps = async () => {
  const bedpresPreviews = await fetchEventPreviews("BEDPRES", 3);
  const eventPreviews = await fetchEventPreviews("EVENT", 3);
  const posts = await fetchPosts(3);

  return {
    props: {
      bedpresPreviews,
      eventPreviews,
      posts,
    },
  };
};

export default HomePage;
