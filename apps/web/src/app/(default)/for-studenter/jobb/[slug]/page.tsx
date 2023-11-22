import { cache } from "react";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
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

export async function generateMetadata({ params }: Props) {
  const { slug } = params;

  const jobAd = await getData(slug);

  return {
    title: jobAd.title,
  };
}

export default async function JobAdPage({ params }: { params: { slug: string } }) {
  const jobAd = await getData(params.slug);

  return (
    <Container>
      <Heading className="mb-4">{jobAd.title}</Heading>
      <Markdown content={jobAd.body} />
    </Container>
  );
}
