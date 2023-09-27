import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/ui/heading";
import { fetchJobAdBySlug } from "@/sanity/job-ad";

type Props = {
  params: {
    slug: string;
  };
};

async function getData(slug: Props["params"]["slug"]) {
  const jobAd = await fetchJobAdBySlug(slug);

  if (!jobAd) {
    return notFound();
  }

  return jobAd;
}

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
      <article className="flex flex-col gap-10">
        <Heading>{jobAd.title}</Heading>

        <Markdown content={jobAd.body} />
      </article>
    </Container>
  );
}
