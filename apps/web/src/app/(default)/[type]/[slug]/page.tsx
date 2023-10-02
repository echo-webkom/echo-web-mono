import { revalidateTag } from "next/cache";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/ui/heading";
import { fetchStaticInfoBySlug, fetchStaticInfoPaths } from "@/sanity/static-info";

type Props = {
  params: {
    type: string;
    slug: string;
  };
};

async function getData(slug: string) {
  const page = await fetchStaticInfoBySlug(slug);

  if (!page) {
    return notFound();
  }

  return page;
}

export async function generateStaticParams() {
  return await fetchStaticInfoPaths();
}

export async function generateMetadata({ params }: Props) {
  const page = await getData(params.slug);

  return {
    title: page.title,
  };
}

export default async function StaticPage({ params }: Props) {
  const page = await getData(params.slug);

  return (
    <Container>
      <article>
        <Heading className="mb-4">{page.title}</Heading>

        <Markdown content={page.body} />
      </article>
    </Container>
  );
}
