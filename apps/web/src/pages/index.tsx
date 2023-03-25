import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {fetchComingEventPreviews} from "@/api/events";
import {fetchJobAds, jobTypeToString} from "@/api/job-ads";
import {fetchPosts} from "@/api/posts";
import {fetchStudentGroupBySlug} from "@/api/student-group";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/avatar";
import EventPreviewBox from "@/components/event-preview";
import Layout from "@/components/layout";
import {isErrorMessage} from "@/utils/error";
import classNames from "classnames";
import {format} from "date-fns";
import nb from "date-fns/locale/nb";
import removeMd from "remove-markdown";

type Props = {
  eventPreviews: Awaited<ReturnType<typeof fetchComingEventPreviews>>;
  bedpresPreviews: Awaited<ReturnType<typeof fetchComingEventPreviews>>;
  posts: Awaited<ReturnType<typeof fetchPosts>>;
  jobAds: Awaited<ReturnType<typeof fetchJobAds>>;
  board: Awaited<ReturnType<typeof fetchStudentGroupBySlug>>;
};

const HomePage: React.FC<Props> = ({eventPreviews, bedpresPreviews, posts, jobAds, board}) => {
  return (
    <>
      <Head>
        <title>echo - Linjeforeningen for informatikk</title>
      </Head>

      <Layout>
        <div className="container mx-auto grid grid-cols-1 gap-y-10 gap-x-5 px-3 lg:grid-cols-2">
          {/* Events  */}
          <section className="flex flex-col gap-5 rounded-md border p-5">
            <h2 className="text-center text-3xl font-semibold">Kommende arrangementer</h2>
            <hr />
            <ul className="flex h-full flex-col items-stretch divide-y">
              {eventPreviews.map((event) => (
                <li key={event._id}>
                  <EventPreviewBox event={event} />
                </li>
              ))}
            </ul>
          </section>

          {/* Bedpresses */}
          <section className="flex flex-col gap-5 rounded-md border p-5">
            <h2 className="text-center text-3xl font-semibold">Kommende bedriftspresentasjoner</h2>
            <hr />
            <ul className="flex h-full flex-col justify-between divide-y">
              {bedpresPreviews.map((bedpres) => (
                <li key={bedpres._id}>
                  <EventPreviewBox event={bedpres} />
                </li>
              ))}
            </ul>
          </section>

          {/* Posts */}
          <section className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2">
            <h2 className="text-center text-3xl font-semibold">Siste nytt</h2>
            <hr />
            <ul className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
              {posts.map((post) => {
                const daysSincePublished =
                  new Date().getDate() - new Date(post._createdAt).getDate();

                return (
                  <li key={post._id}>
                    <Link href={`/for-students/post/${post.slug}`}>
                      <div
                        className={classNames(
                          "relative flex h-auto flex-col gap-1 rounded-lg p-5",
                          "hover:bg-neutral-100",
                          "transition-colors duration-200 ease-in-out",
                        )}
                      >
                        {daysSincePublished < 3 && (
                          <p className="w-fit rounded-lg bg-red-300 px-2 py-1 text-sm">
                            Nytt innlegg!
                          </p>
                        )}
                        <h3 className="flex gap-2 text-2xl font-semibold line-clamp-2">
                          {post.title.no}
                        </h3>
                        <p>
                          Publisert:{" "}
                          {format(new Date(post._createdAt), "d. MMMM yyyy", {
                            locale: nb,
                          })}
                        </p>
                        <hr />
                        <p className="italic line-clamp-4">{removeMd(post.body.no)}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Job ads */}
          <section className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2">
            <h2 className="text-center text-3xl font-semibold">Jobbannonser</h2>
            <hr />
            <ul className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
              {jobAds.map((jobAd) => (
                <li key={jobAd._id}>
                  <Link href={`/for-students/job/${jobAd.slug}`}>
                    <div
                      className={classNames(
                        "flex h-full flex-row items-center gap-5 rounded-lg p-5",
                        "hover:bg-neutral-100",
                        "transition-colors duration-200 ease-in-out",
                      )}
                    >
                      {jobAd.logoUrl && (
                        <div className="hidden md:block">
                          <div className="relative h-32 w-32 overflow-hidden rounded-full border bg-[#FFF]">
                            <Image src={jobAd.logoUrl} alt={`${jobAd.companyName} logo`} fill />
                          </div>
                        </div>
                      )}
                      <div className="flex w-full flex-col gap-1 overflow-x-hidden">
                        <h3 className="truncate text-2xl font-semibold">{jobAd.title}</h3>
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

          {/* Board */}
          {!isErrorMessage(board) && (
            <section className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2">
              <h2 className="text-center text-3xl font-semibold">Hovedstyret</h2>
              <hr />
              <ul className="grid grid-cols-1 gap-x-3 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
                {board.members.map((member) => (
                  <li key={member.profile.name}>
                    <div className="flex h-full flex-col items-center gap-5 p-5">
                      <Avatar className="border">
                        <AvatarImage
                          src={member.profile.imageUrl ?? ""}
                          alt={`${member.profile.name} profilbilde`}
                        />
                        <AvatarFallback className="text-xl">
                          {member.profile.name
                            .split(" ")
                            .map((name) => name[0])
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex w-full flex-col gap-1 overflow-x-hidden text-center">
                        <h3 className="truncate text-2xl font-semibold">{member.profile.name}</h3>
                        <p>{member.role}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </Layout>
    </>
  );
};

const EVENT_COUNT = 5;
const POST_COUNT = 4;
const JOB_COUNT = 3;

export const getServerSideProps = async () => {
  const [bedpresPreviews, eventPreviews, posts, jobAds, board] = await Promise.all([
    fetchComingEventPreviews("BEDPRES", EVENT_COUNT),
    fetchComingEventPreviews("EVENT", EVENT_COUNT),
    fetchPosts(POST_COUNT),
    fetchJobAds(JOB_COUNT),
    fetchStudentGroupBySlug("2023-2024"),
  ]);

  return {
    props: {
      bedpresPreviews,
      eventPreviews,
      posts,
      jobAds,
      board,
    },
  };
};

export default HomePage;
