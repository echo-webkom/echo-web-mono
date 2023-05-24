import Link from "next/link";

import Container from "@/components/container";
import {HappeningPreviewBox} from "@/components/happening-preview-box";
import JobAdPreview from "@/components/job-ad-preview";
import PostPreview from "@/components/post-preview";
import {fetchUpcomingBedpresses} from "@/sanity/bedpres";
import {fetchComingEvents} from "@/sanity/event";
import {fetchJobAds} from "@/sanity/job-ad";
import {fetchPosts} from "@/sanity/posts";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [events, bedpresses, posts, jobAds] = await Promise.all([
    fetchComingEvents(5),
    fetchUpcomingBedpresses(5),
    fetchPosts(5),
    fetchJobAds(5),
  ]);

  return (
    <Container className="grid grid-cols-1 gap-x-5 gap-y-12 px-3 lg:grid-cols-2">
      {/* Events  */}
      <section className="flex flex-col gap-5 rounded-md border p-5">
        <HappeningPreviewBox type="EVENT" happenings={events} />
      </section>

      {/* Bedpresses */}
      <section className="flex flex-col gap-5 rounded-md border p-5">
        <HappeningPreviewBox type="BEDPRES" happenings={bedpresses} />
      </section>

      {/* Posts */}
      <section className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2">
        <Link href="/for-students/posts">
          <h2 className="text-center text-3xl font-semibold">Siste nytt</h2>
        </Link>

        <hr />

        <ul className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
          {posts.map((post) => (
            <li key={post._id}>
              <PostPreview post={post} />
            </li>
          ))}
        </ul>
      </section>

      {/* Job ads */}
      <section className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2">
        <Link href="/for-students/jobs">
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
    </Container>
  );
}
