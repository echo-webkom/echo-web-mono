import Link from "next/link";
import { LuArrowRight as ArrowRight } from "react-icons/lu";

import { auth } from "@echo-webkom/auth";

import { Container } from "@/components/container";
import { HyggkomShoppingList } from "@/components/hyggkom-shopping-list";
import { JobAdPreview } from "@/components/job-ad-preview";
import MovieClubCard from "@/components/movie-club-card";
import { PostPreview } from "@/components/post-preview";
import { getAllShoppinglistItems } from "@/data/shopping-list-item/queries";
import { fetchHomeHappenings } from "@/sanity/happening";
import { fetchAvailableJobAds } from "@/sanity/job-ad";
import { fetchPosts } from "@/sanity/posts";
import { HappeningPreview } from "./_components/happening-preview";

const NUM_HAPPENINGS = !isNaN(Number(process.env.NUM_HAPPENINGS))
  ? Number(process.env.NUM_HAPPENINGS)
  : 4;

export default async function HomePage() {
  const authData = auth();
  const eventData = fetchHomeHappenings(["event", "external"], NUM_HAPPENINGS);
  const bedpresData = fetchHomeHappenings(["bedpres"], NUM_HAPPENINGS);
  const postData = fetchPosts(2);
  const jobData = fetchAvailableJobAds(4);
  const shoppingListData = getAllShoppinglistItems();

  const [user, events, bedpresses, posts, jobAds, items] = await Promise.all([
    authData,
    eventData,
    bedpresData,
    postData,
    jobData,
    shoppingListData,
  ]);

  const withDots = items.length > 5 ? true : false;

  const mappedItems = items
    .map((item) => ({
      id: item.id,
      name: item.name,
      user: null,
      likes: item.likes.length,
      hasLiked: item.likes.some((like) => (user?.id ? like.userId === user.id : false)),
    }))
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);

  const isAdmin = false;

  return (
    <>
      <Container className="relative pb-40">
        <div className="mx-auto w-full max-w-screen-xl py-10">
          <div className="max-w-xl space-y-8">
            <h1>
              <span className="text-xl font-medium sm:text-3xl">Velkommen til</span>
              <br />
              <span className="text-4xl font-bold sm:text-5xl">
                echo – Linjeforeningen for informatikk
              </span>
            </h1>
            <p>
              Vi i echo jobber med å gjøre studiehverdagen for informatikkstudenter bedre ved å
              arrangere sosiale og faglige arrangementer.
              <br /> Les mer{" "}
              <Link
                className="font-semibold underline underline-offset-2 hover:text-primary"
                href="/om/echo"
              >
                her.
              </Link>
            </p>
          </div>
        </div>
      </Container>

      <Container className="relative -top-20 grid grid-cols-1 gap-x-5 gap-y-12 px-3 lg:grid-cols-2">
        {/* Events  */}
        <section className="flex flex-col gap-5 rounded-md border bg-background p-5 shadow-lg transition-shadow hover:shadow-xl">
          <Link
            href="/for-studenter/arrangementer?type=event"
            className="group mx-auto flex items-center underline-offset-4 hover:underline"
          >
            <h2 className="text-center text-3xl font-medium">Arrangementer</h2>

            <ArrowRight className="ml-2 inline h-6 w-6 transition-transform group-hover:translate-x-2" />
          </Link>
          <hr />
          <ul>
            {events.map((event) => {
              return (
                <li key={event._id}>
                  <HappeningPreview happening={event} />
                </li>
              );
            })}
          </ul>
        </section>

        {/* Bedpresses */}
        <section className="flex flex-col gap-5 rounded-md border bg-background p-5 shadow-lg transition-shadow hover:shadow-xl">
          <Link
            href="/for-studenter/arrangementer?type=bedpres"
            className="group mx-auto flex items-center underline-offset-4 hover:underline"
          >
            <h2 className="text-center text-2xl font-medium md:text-3xl">Bedriftspresentasjoner</h2>

            <ArrowRight className="ml-2 inline h-6 w-6 transition-transform group-hover:translate-x-2" />
          </Link>
          <hr />
          <ul>
            {bedpresses.map((bedpres) => {
              return (
                <li key={bedpres._id}>
                  <HappeningPreview happening={bedpres} />
                </li>
              );
            })}
          </ul>
        </section>

        {/* Job ads */}
        {jobAds.length > 0 && (
          <section className="flex flex-col gap-5 rounded-md border p-5 shadow-lg lg:col-span-2">
            <Link
              href="/for-studenter/jobber"
              className="group mx-auto flex items-center underline-offset-4 hover:underline"
            >
              <h2 className="text-center text-xl font-semibold md:text-3xl">
                Jobbannonser
                <ArrowRight className="ml-2 inline h-6 w-6 transition-transform group-hover:translate-x-2" />
              </h2>
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

        {/* Posts */}
        <section className="flex flex-col gap-5 rounded-md border p-5 shadow-lg lg:col-span-1">
          <Link
            href="/for-studenter/innlegg"
            className="group mx-auto flex items-center underline-offset-4 hover:underline"
          >
            <h2 className="group text-center text-xl font-semibold decoration-1 md:text-3xl">
              Siste nytt
              <ArrowRight className="ml-2 inline h-6 w-6 transition-transform group-hover:translate-x-2" />
            </h2>
          </Link>

          <hr />

          <ul className="grid grid-cols-1 gap-x-3 gap-y-5 py-4">
            {posts.map((post) => (
              <li key={post._id}>
                <PostPreview post={post} className="shadow-none" />
              </li>
            ))}
          </ul>
        </section>

        {/* Hyggkom handleliste */}
        <section className="flex flex-col gap-5 rounded-md border p-5 shadow-lg lg:col-span-1">
          <Link
            href="/for-studenter/handleliste"
            className="group mx-auto flex items-center underline-offset-4 hover:underline"
          >
            <h2 className="text-center text-2xl font-medium md:text-3xl">Hyggkom Handleliste</h2>

            <ArrowRight className="ml-2 inline h-6 w-6 transition-transform group-hover:translate-x-2" />
          </Link>

          <hr />
          <HyggkomShoppingList items={mappedItems} isAdmin={isAdmin} withDots={withDots} />
        </section>

        {/*Filmklubb*/}
        <section className="flex flex-col gap-5 rounded-md border p-5 shadow-lg lg:col-span-1">
          <div className="group mx-auto flex items-center">
            <h2 className="text-center text-3xl font-medium">Mandagens Visning</h2>
          </div>
          <hr />
          <MovieClubCard />
        </section>
      </Container>
    </>
  );
}
