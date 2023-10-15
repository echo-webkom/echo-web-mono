import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma, type Prisma } from "@echo-webkom/db";
import { groupToString, registrationStatusToString } from "@echo-webkom/lib";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { getHappeningBySlug } from "@/lib/queries/happening";

import { cn } from "@/utils/cn";
import { EditRegistrationButton } from "@/components/edit-registration-button";
import { HappeningPreviewBox } from "@/components/happening-preview-box";
import { JobAdPreview } from "@/components/job-ad-preview";
import { PostPreview } from "@/components/post-preview";
import { $fetchAllBedpresses, fetchUpcomingBedpresses } from "@/sanity/bedpres";
import { fetchComingEvents } from "@/sanity/event";
import { fetchAvailableJobAds } from "@/sanity/job-ad";
import { fetchPosts } from "@/sanity/posts";


type Props = {
  params: {
    slug: string;
  };
};

export default async function EventDashboard({}: Props) {
    const [events, bedpresses, posts, jobAds] = await Promise.all([
      fetchComingEvents(3),
      $fetchAllBedpresses(),
      fetchPosts(4),
      fetchAvailableJobAds(4),
    ]);

  return (
    <Container className="flex flex-col gap-10">
      <Heading>
        Dashboard:
      </Heading>

      <section className="flex flex-col gap-5 rounded-md border bg-background p-5 shadow-lg">
        <HappeningPreviewBox type="EVENT" happenings={events} />
      </section>

      {/* Bedpresses */}
      <section className="flex flex-col gap-5 rounded-md border bg-background p-5 shadow-lg">
        <HappeningPreviewBox type="BEDPRES" happenings={bedpresses} />
      </section>

      <div className="flex flex-col gap-3">
      </div>
    </Container>
  );
}

