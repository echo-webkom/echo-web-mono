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
import {
  opacityStaggeredChildren,
  staggeredListContainer,
  verticalStaggeredChildren,
} from "@/utils/animations/helpers";
import {isErrorMessage} from "@/utils/error";
import cn from "classnames";
import {format} from "date-fns";
import nb from "date-fns/locale/nb";
import {motion} from "framer-motion";
import removeMd from "remove-markdown";

type Props = {
  eventPreviews: Awaited<ReturnType<typeof fetchComingEventPreviews>>;
  bedpresPreviews: Awaited<ReturnType<typeof fetchComingEventPreviews>>;
  posts: Awaited<ReturnType<typeof fetchPosts>>;
  jobAds: Awaited<ReturnType<typeof fetchJobAds>>;
  board: Awaited<ReturnType<typeof fetchStudentGroupBySlug>>;
};

const HomePage = ({eventPreviews, bedpresPreviews, posts, jobAds, board}: Props) => {
  return (
    <>
      <Head>
        <title>echo - Linjeforeningen for informatikk</title>
      </Head>

      <Layout>
        <div className="container mx-auto grid grid-cols-1 gap-y-12 gap-x-5 px-3 lg:grid-cols-2">
          {/* Events  */}
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
            <motion.ul
              initial="hidden"
              animate="show"
              variants={staggeredListContainer}
              className="flex h-full flex-col items-stretch divide-y overflow-hidden"
            >
              {eventPreviews.map((event) => (
                <motion.li variants={opacityStaggeredChildren} key={event._id}>
                  <EventPreviewBox event={event} />
                </motion.li>
              ))}
            </motion.ul>
          </section>

          {/* Bedpresses */}
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
            <motion.ul
              initial="hidden"
              animate="show"
              variants={staggeredListContainer}
              className="flex h-full flex-col justify-between divide-y"
            >
              {bedpresPreviews.map((bedpres) => (
                <motion.li variants={opacityStaggeredChildren} key={bedpres._id}>
                  <EventPreviewBox event={bedpres} />
                </motion.li>
              ))}
            </motion.ul>
          </section>

          {/* Posts */}
          <motion.section
            initial={{x: "-15%", opacity: 0}}
            whileInView={{x: "0%", opacity: 1}}
            viewport={{once: true}}
            transition={{
              type: "tween",
              ease: "easeInOut",
              duration: 0.5,
            }}
            className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2"
          >
            <Link href="/for-students/post">
              <h2 className="text-center text-3xl font-semibold">Siste nytt</h2>
            </Link>
            <hr />
            <ul className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
              {posts.map((post) => {
                const daysSincePublished =
                  new Date().getDate() - new Date(post._createdAt).getDate();

                return (
                  <motion.li
                    initial="hidden"
                    whileInView="show"
                    transition={{
                      delay: 2,
                    }}
                    variants={staggeredListContainer}
                    viewport={{once: true}}
                    key={post._id}
                    className="overflow-hidden"
                  >
                    <Link href={`/for-students/post/${post.slug}`}>
                      <motion.div
                        variants={opacityStaggeredChildren}
                        className={cn(
                          "relative flex h-auto flex-col gap-1 rounded-lg p-5",
                          "hover:bg-neutral-100",
                          "transition-colors duration-200 ease-in-out",
                        )}
                      >
                        {daysSincePublished < 3 && (
                          <div className="overflow-hidden">
                            <motion.p
                              initial={{y: "100%"}}
                              whileInView={{y: "0%"}}
                              viewport={{once: true}}
                              transition={{
                                delay: 0.25,
                                type: "tween",
                                ease: "easeInOut",
                              }}
                              className="w-fit rounded-lg bg-red-300 px-2 py-1 text-sm"
                            >
                              Nytt innlegg!
                            </motion.p>
                          </div>
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
                      </motion.div>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.section>

          {/* Job ads */}
          <motion.section
            initial={{x: "-15%", opacity: 0}}
            whileInView={{x: "0%", opacity: 1}}
            viewport={{once: true}}
            transition={{
              type: "tween",
              ease: "easeInOut",
              duration: 0.5,
            }}
            className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2"
          >
            <Link href="/for-students/job">
              <h2 className="text-center text-3xl font-semibold">Jobbannonser</h2>
            </Link>
            <hr />
            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{once: true}}
              variants={staggeredListContainer}
              className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2"
            >
              {jobAds.map((jobAd) => (
                <motion.li variants={opacityStaggeredChildren} key={jobAd._id}>
                  <Link href={`/for-students/job/${jobAd.slug}`}>
                    <div
                      className={cn(
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
                              className={cn("font-semibold", {
                                "line-through": new Date(jobAd.deadline) < new Date(),
                              })}
                            >
                              Søknadsfrist:
                            </span>{" "}
                            {new Date(jobAd.deadline) < new Date() ? (
                              <span className="text-red-500">Utløpt</span>
                            ) : (
                              format(new Date(jobAd.deadline), "d. MMMM yyyy", {
                                locale: nb,
                              })
                            )}
                          </li>
                          <li>
                            <span className="font-semibold">Stillingstype:</span>{" "}
                            {jobTypeToString[jobAd.jobType]}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>

          {/* Board */}
          {!isErrorMessage(board) && (
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
                {board.members.map((member) => (
                  <li key={member.profile.name}>
                    <div className="flex h-full flex-col items-center gap-5 p-5">
                      <Avatar className="overflow-hidden border">
                        <motion.div
                          variants={verticalStaggeredChildren}
                          whileHover={{
                            scale: 1.1,
                            transition: {duration: 0.3},
                          }}
                        >
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
        </div>
      </Layout>
    </>
  );
};

const EVENT_COUNT = 4;
const POST_COUNT = 4;
const JOB_COUNT = 4;

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
