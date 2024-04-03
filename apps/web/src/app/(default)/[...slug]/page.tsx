import { cache } from "react";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { Logger } from "@/lib/logger";
import { fetchStaticInfoBySlug } from "@/sanity/static-info";

export const revalidate = 86400; // 24 hours
export const dynamicParams = false;

type Props = {
  params: {
    slug: Array<string> | undefined;
  };
};

const getData = cache(async (slugs: Props["params"]["slug"] = []) => {
  const [pageType, slug] = slugs;

  if (typeof pageType !== "string" || typeof slug !== "string") {
    return notFound();
  }

  const page = await fetchStaticInfoBySlug(pageType, slug);

  if (!page) {
    Logger.info("Page not found", `Failed to find page with slug: ${pageType}/${slug}`);
    return notFound();
  }

  return page;
});

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
