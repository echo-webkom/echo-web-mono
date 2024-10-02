import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getNewPageMetadata } from "@/app/seo";
import { Container } from "@/components/container";
import { JobAdSidebar } from "@/components/job-ad-sidebar";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { fetchJobAdBySlug } from "@/sanity/job-ad";

type Props = {
  params: {
    slug: string;
  };
};

const getData = cache(async (slug: Props["params"]["slug"]) => {
  const jobAd = await fetchJobAdBySlug(slug);

  if (!jobAd) {
    return notFound();
  }

  return jobAd;
});

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = params;
  const jobAd = await getData(slug);

  return getNewPageMetadata(
    jobAd.title,
    `Ny stilling hos ${jobAd.company.name}, ${jobAd.locations[0]?.name}.`,
  );
};

export default async function JobAdPage({ params }: { params: { slug: string } }) {
  const jobAd = await getData(params.slug);

  return (
    <Container className="py-10">
      <Link className="hover:underline" href="/for-studenter/jobber">
        ← Tilbake til alle stillingsannonser
      </Link>

      <div className="flex w-full flex-col-reverse gap-24 py-10 md:flex-row lg:max-w-[1500px]">
        <div className="pt-4 sm:pt-0">
          <Heading className="mb-4">{jobAd.title}</Heading>
          <Markdown content={jobAd.body} />
        </div>
        <JobAdSidebar jobAd={jobAd} />
      </div>
    </Container>
  );
}
