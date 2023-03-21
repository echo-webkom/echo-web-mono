import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {fetchComingEventPreviews} from "@/api/events";
import {fetchJobAds, jobTypeToString} from "@/api/job-ads";
import {fetchPosts} from "@/api/posts";
import {Button} from "@/components/button";
import {Layout} from "@/components/layout";
import {capitalize} from "@/utils/string";
import classNames from "classnames";
import {format} from "date-fns";
import nb from "date-fns/locale/nb";
import removeMd from "remove-markdown";

type Props = {
  eventPreviews: Awaited<ReturnType<typeof fetchComingEventPreviews>>;
  bedpresPreviews: Awaited<ReturnType<typeof fetchComingEventPreviews>>;
  posts: Awaited<ReturnType<typeof fetchPosts>>;
  jobAds: Awaited<ReturnType<typeof fetchJobAds>>;
};

const HomePage: React.FC<Props> = ({eventPreviews, bedpresPreviews, posts, jobAds}) => {
  return (
    <>
      <Head>
        <title>echo - Linjeforeningen for informatikk</title>
      </Head>

      <Layout>
        <div className="container mx-auto flex flex-col">
          <section className="my-20 flex flex-col gap-5 text-center">
            <h2 className="text-2xl">Hei, og velkommen til</h2>
            <h2 className="text-5xl font-bold">echo - Linjeforeningen for informatikk</h2>
            <div className="mx-auto my-10 flex w-full max-w-2xl flex-col gap-8 md:flex-row">
              <Button intent="primary" size="large" fullWidth>
                Arrangementer
              </Button>
              <Button intent="secondary" size="large" fullWidth>
                For bedrifter
              </Button>
            </div>
          </section>
        </div>

        <div className="container mx-auto grid grid-cols-1 gap-y-10 gap-x-5 px-3 lg:grid-cols-2">
          {/* Events  */}
          <section className="flex flex-col gap-5 rounded-md border p-5">
            <h2 className="mx-auto text-3xl font-semibold">Kommende arrangementer</h2>
            <hr />
            <ul className="flex flex-col gap-5 divide-y">
              {eventPreviews.map((event) => (
                <li key={event._id}>
                  <Link href={`/event/${event.slug}`}>
                    <div className="flex h-40 gap-5 p-5 hover:bg-neutral-100">
                      <div className="flex w-full flex-col gap-1">
                        <h3 className="text-2xl font-semibold">{event.title}</h3>
                        <ul>
                          <li>
                            <span className="font-semibold">Gruppe:</span>{" "}
                            {capitalize(event.studentGroupName)}
                          </li>
                          <li>
                            <span className="font-semibold">Dato:</span>{" "}
                            {format(new Date(event.date), "d. MMMM yyyy", {locale: nb})}
                          </li>
                          {event.registrationDate && (
                            <li>
                              <span className="font-semibold">Påmelding:</span>{" "}
                              {format(new Date(event.registrationDate), "d. MMMM yyyy", {
                                locale: nb,
                              })}
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Bedpresses */}
          <section className="flex flex-col gap-5 rounded-md border p-5">
            <h2 className="mx-auto text-3xl font-semibold">Kommende bedriftspresentasjoner</h2>
            <hr />
            <ul className="flex flex-col gap-5 divide-y">
              {bedpresPreviews.map((bedpres) => (
                <li key={bedpres._id}>
                  <Link href={`/event/${bedpres.slug}`}>
                    <div className="flex h-40 gap-5 p-5 hover:bg-neutral-100">
                      {bedpres.logoUrl && (
                        <div className="flex items-center">
                          <div className="relative h-28 w-28 overflow-hidden rounded-full border bg-[#FFF]">
                            <Image src={bedpres.logoUrl} alt={`${bedpres.title} logo`} fill />
                          </div>
                        </div>
                      )}
                      <div className="flex w-full flex-col gap-1">
                        <h3 className="text-2xl font-semibold">{bedpres.title}</h3>
                        <ul>
                          <li>
                            <span className="font-semibold">Dato:</span>{" "}
                            {format(new Date(bedpres.date), "d. MMMM yyyy", {locale: nb})}
                          </li>
                          {bedpres.registrationDate && (
                            <li>
                              <span className="font-semibold">Påmelding:</span>{" "}
                              {format(new Date(bedpres.registrationDate), "d. MMMM yyyy", {
                                locale: nb,
                              })}
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Posts */}
          <section className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2">
            <h2 className="mx-auto text-3xl font-semibold">Siste nytt</h2>
            <hr />
            <ul className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
              {posts.map((post) => (
                <li key={post._id}>
                  <Link href={`/for-students/post/${post.slug}`}>
                    <div className="flex h-auto flex-col gap-5 p-5 hover:bg-neutral-100">
                      <h3 className="text-2xl font-semibold">{post.title.no}</h3>
                      <hr />
                      <p className="italic">
                        {removeMd(post.body.no).length > 100
                          ? '"' + removeMd(post.body.no).substring(0, 300) + "..." + '"'
                          : '"' + removeMd(post.body.no) + '"'}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Job ads */}
          <section className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2">
            <h2 className="mx-auto text-3xl font-semibold">Jobbannonser</h2>
            <hr />
            <ul className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
              {jobAds.map((jobAd) => (
                <li key={jobAd._id}>
                  <Link href={`/for-students/job/${jobAd.slug}`}>
                    <div className="flex h-full flex-row items-center gap-5 p-5 hover:bg-neutral-100">
                      {jobAd.logoUrl && (
                        <div>
                          <div className="relative h-32 w-32 overflow-hidden rounded-full border bg-[#FFF]">
                            <Image src={jobAd.logoUrl} alt={`${jobAd.companyName} logo`} fill />
                          </div>
                        </div>
                      )}
                      <div className="flex w-full flex-col gap-1">
                        <h3 className="text-2xl font-semibold">{jobAd.title}</h3>
                        <hr />
                        <ul>
                          <li>
                            <span className="font-semibold">Bedrift:</span> {jobAd.companyName}
                          </li>
                          <li>
                            <span className="font-semibold">Sted:</span>{" "}
                            {jobAd.locations.join(", ")}
                          </li>
                          <li>
                            <span
                              className={classNames("font-semibold", {
                                "text-red-500": new Date(jobAd.deadline) < new Date(),
                              })}
                            >
                              Søknadsfrist:
                            </span>{" "}
                            {format(new Date(jobAd.deadline), "d. MMMM yyyy", {
                              locale: nb,
                            })}
                          </li>
                          <li>
                            <span className="font-semibold">Stillingstype:</span>{" "}
                            {jobTypeToString[jobAd.jobType]}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Layout>
    </>
  );
};

const EVENT_COUNT = 5;
const POST_COUNT = 4;

export const getServerSideProps = async () => {
  const bedpresPreviews = await fetchComingEventPreviews("BEDPRES", EVENT_COUNT);
  const eventPreviews = await fetchComingEventPreviews("EVENT", EVENT_COUNT);
  const posts = await fetchPosts(POST_COUNT);
  const jobAds = await fetchJobAds(3);

  return {
    props: {
      bedpresPreviews,
      eventPreviews,
      posts,
      jobAds,
    },
  };
};

export default HomePage;
