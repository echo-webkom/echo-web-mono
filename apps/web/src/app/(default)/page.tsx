import Link from "next/link";

import {Container} from "@/components/container";
import {HappeningPreviewBox} from "@/components/happening-preview-box";
import {JobAdPreview} from "@/components/job-ad-preview";
import {PostPreview} from "@/components/post-preview";
import {Button} from "@/components/ui/button";
import {fetchUpcomingBedpresses} from "@/sanity/bedpres";
import {fetchComingEvents} from "@/sanity/event";
import {fetchAvailableJobAds} from "@/sanity/job-ad";
import {fetchPosts} from "@/sanity/posts";

export default async function HomePage() {
  const [events, bedpresses, posts, jobAds] = await Promise.all([
    fetchComingEvents(3),
    fetchUpcomingBedpresses(3),
    fetchPosts(4),
    fetchAvailableJobAds(4),
  ]);

  return (
    <div className="relative">
      <Container className="relative bg-banner pb-40 pt-24" layout="full">
        <div className="mx-auto w-full max-w-screen-xl text-white">
          <div className="max-w-xl space-y-8">
            <h1>
              <span className="text-xl font-medium sm:text-3xl">Velkommen til</span>
              <br />
              <span className="text-4xl font-bold sm:text-5xl">
                echo &ndash; Linjeforeningen for informatikk
              </span>
            </h1>
            <p>
              Vi jobber utelukkende med å gjøre studiehverdagen for oss informatikere bedre og er
              studentenes stemme opp mot instituttet, fakultetet og arbeidsmarkedet.
            </p>
            <div>
              <Button asChild variant="secondary">
                <Link href="/for-students">Bli medlem</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <Container className="relative -top-10 grid grid-cols-1 gap-x-5 gap-y-12 px-3 lg:grid-cols-2">
        {/* Events  */}
        <section className="flex flex-col gap-5 rounded-md border bg-background p-5">
          <HappeningPreviewBox type="EVENT" happenings={events} />
        </section>

        {/* Bedpresses */}
        <section className="flex flex-col gap-5 rounded-md border bg-background p-5">
          <HappeningPreviewBox type="BEDPRES" happenings={bedpresses} />
        </section>

        {/* Posts */}
        <section className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2">
          <Link href="/for-students/posts">
            <h2 className="text-center text-xl font-semibold md:text-3xl">Siste nytt</h2>
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
        {jobAds.length > 0 && (
          <section className="flex flex-col gap-5 rounded-md border p-5 lg:col-span-2">
            <Link href="/for-students/jobs">
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
      </Container>
    </div>
  );
}
