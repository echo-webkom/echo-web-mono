import {type InferGetServerSidePropsType} from "next";
import Head from "next/head";
import Link from "next/link";
import {format} from "date-fns";
import {nb} from "date-fns/locale";
import {motion} from "framer-motion";
import removeMd from "remove-markdown";

import {fetchUpcomingBedpresses} from "@/api/bedpres";
import {fetchComingEvents} from "@/api/event";
import {fetchJobAds} from "@/api/job-ad";
import {fetchPosts} from "@/api/posts";
import {fetchStudentGroupsByType} from "@/api/student-group";
import BedpresPreviewBox from "@/components/bedpres-preview";
import Container from "@/components/container";
import EventPreviewBox from "@/components/event-preview";
import JobAdPreview from "@/components/jobad-preview";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Layout from "@/layouts/layout";
import {staggeredListContainer, verticalStaggeredChildren} from "@/utils/animations/helpers";
import {cn} from "@/utils/cn";
import {isErrorMessage} from "@/utils/error";

const HomePage = ({
  events,
  bedpresses,
  posts,
  jobAds,
  board,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>echo – Linjeforeningen for informatikk</title>
      </Head>

      <Layout>
        <Container className="mx-auto grid grid-cols-1 gap-x-5 gap-y-12 px-3 lg:grid-cols-2">
          {/* Events  */}
          {!isErrorMessage(events) && (
            <section className="flex flex-col gap-5 rounded-md border p-5">
              <Link href="/event" className="min-h-[2.5rem] overflow-hidden">
                <motion.h2
                  initial={{y: "100%"}}
                  animate={{y: "0%"}}
                  transition={{
                    duration: 0.25,
                  }}
                  className="text-center text-3xl font-semibold"
                >
                  Arrangementer
                </motion.h2>
              </Link>
              <hr />
              <ul className="flex h-full flex-col items-stretch divide-y overflow-hidden">
                {events.map((event) => (
                  <li key={event._id}>
                    <EventPreviewBox event={event} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Bedpresses */}
          {!isErrorMessage(bedpresses) && (
            <section className="flex flex-col gap-5 rounded-md border p-5">
              <Link href="/event" className="min-h-[2.5rem] overflow-hidden">
                <motion.h2
                  initial={{y: "100%"}}
                  animate={{y: "0%"}}
                  transition={{
                    duration: 0.25,
                  }}
                  className="text-center text-3xl font-semibold"
                >
                  Bedriftspresentasjoner
                </motion.h2>
              </Link>
              <hr />
              <ul className="flex h-full flex-col justify-between divide-y">
                {bedpresses.map((bedpres) => (
                  <li key={bedpres._id}>
                    <BedpresPreviewBox bedpres={bedpres} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Posts */}
          {!isErrorMessage(posts) && (
            <section className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2">
              <Link href="/for-students/post">
                <h2 className="text-center text-3xl font-semibold">Siste nytt</h2>
              </Link>
              <hr />
              <ul className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
                {posts.map((post) => (
                  <li key={post._id}>
                    <Link href={`/for-students/post/${post.slug}`}>
                      <div
                        className={cn(
                          "relative flex h-auto flex-col gap-1 rounded-lg p-5",
                          "hover:bg-neutral-100",
                          "transition-colors duration-200 ease-in-out",
                        )}
                      >
                        <h3 className="line-clamp-2 flex gap-2 text-2xl font-semibold">
                          {post.title}
                        </h3>
                        <p>
                          Publisert:{" "}
                          {format(new Date(post._createdAt), "d. MMMM yyyy", {
                            locale: nb,
                          })}
                        </p>
                        <hr />
                        <p className="line-clamp-4 italic">{removeMd(post.body)}</p>
                        <p>Skrevet av: {post.authors.map((author) => author.name).join(", ")}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Job ads */}
          {!isErrorMessage(jobAds) && (
            <section className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2">
              <Link href="/for-students/job">
                <h2 className="text-center text-3xl font-semibold">Jobbannonser</h2>
              </Link>
              <hr />
              <ul className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
                {jobAds.map((jobAd) => (
                  <li key={jobAd._id}>
                    <JobAdPreview jobAd={jobAd} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Board */}
          {!isErrorMessage(board) && board[0]?.members && (
            <section className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2">
              <Link href="/for-students/board">
                <h2 className="text-center text-3xl font-semibold">Hovedstyret</h2>
              </Link>
              <hr />
              <motion.ul
                variants={staggeredListContainer}
                initial="hidden"
                whileInView="show"
                viewport={{once: true}}
                className="grid grid-cols-1 gap-x-3 gap-y-5 md:grid-cols-2 lg:grid-cols-3"
              >
                {board[0].members.map((member) => (
                  <li key={member.profile._id}>
                    <div className="flex h-full flex-col items-center gap-5 p-5">
                      <Avatar className="overflow-hidden border">
                        <motion.div variants={verticalStaggeredChildren}>
                          <AvatarImage
                            src={member.profile.imageUrl ?? ""}
                            alt={`${member.profile.name} profilbilde`}
                          />
                        </motion.div>
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
              </motion.ul>
            </section>
          )}
        </Container>
      </Layout>
    </>
  );
};

export const getServerSideProps = async () => {
  const [events, bedpresses, posts, jobAds, board] = await Promise.all([
    fetchComingEvents(5),
    fetchUpcomingBedpresses(5),
    fetchPosts(5),
    fetchJobAds(5),
    fetchStudentGroupsByType("board", 1),
  ]);

  return {
    props: {
      events,
      bedpresses,
      posts,
      jobAds,
      board,
    },
  };
};

export default HomePage;
