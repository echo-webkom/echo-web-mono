import Link from "next/link";

import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { HappeningPreviewBox } from "@/components/happening-preview-box";
import { JobAdPreview } from "@/components/job-ad-preview";
import { PostPreview } from "@/components/post-preview";
import { Button } from "@/components/ui/button";
import { fetchUpcomingBedpresses } from "@/sanity/bedpres";
import { fetchComingEvents } from "@/sanity/event";
import { fetchAvailableJobAds } from "@/sanity/job-ad";
import { fetchPosts } from "@/sanity/posts";
import { type ShoppingListItems } from "@echo-webkom/db/schemas";

export async function Content() {
  const [events, bedpresses, posts, jobAds] = await Promise.all([
    fetchComingEvents(3),
    fetchUpcomingBedpresses(3),
    fetchPosts(4),
    fetchAvailableJobAds(4),
  ]);

  const itemNames = await db.query.shoppingListItems.findMany({
    orderBy: (shoppingListItems, {desc}) => [desc(shoppingListItems.createdAt)],
    limit: 5,
  });

  return (
    <Container className="relative -top-20 grid grid-cols-1 gap-x-5 gap-y-12 px-3 lg:grid-cols-2">
      {/* Events  */}
      <section className="flex flex-col gap-5 rounded-md border bg-background p-5 shadow-lg">
        <HappeningPreviewBox type="EVENT" happenings={events} />
      </section>

      {/* Bedpresses */}
      <section className="flex flex-col gap-5 rounded-md border bg-background p-5 shadow-lg">
        <HappeningPreviewBox type="BEDPRES" happenings={bedpresses} />
      </section>

      {/* Posts */}
      <section className="flex flex-col gap-5 rounded-md border p-5 shadow-lg lg:col-span-2">
        <Link href="/for-studenter/innlegg">
          <h2 className="text-center text-xl font-semibold md:text-3xl">Siste nytt</h2>
        </Link>

        <hr />

        <ul className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
          {posts.map((post) => (
            <li key={post._id}>
              <PostPreview post={post} className="shadow-none" />
            </li>
          ))}
        </ul>
      </section>

      {/* Job ads */}
      {jobAds.length > 0 && (
        <section className="flex flex-col gap-5 rounded-md border p-5 shadow-lg lg:col-span-2">
          <Link href="/for-studenter/jobber">
            <h2 className="text-center text-xl font-semibold md:text-3xl">Jobbannonser</h2>
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

      {/* Hyggkom */}
      <section className="flex flex-col gap-5 rounded-md border p-5 shadow-lg lg:col-span-2">
        <Link href="/handleliste">
          <h2 className="text-center text-xl font-semibold md:text-3xl">Hyggkom Handleliste</h2>
        </Link>

        <hr />

        <ul className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
          {itemNames.map((item: ShoppingListItems) => (
            <li key={item.id} className="grid grid-cols-2">
              <p>{item.name}</p>
          </li>
          ))}
        </ul>
        <Button>
          <Link href="/handleliste">Se mer</Link>
        </Button>
      </section>
    </Container>
  );
}
