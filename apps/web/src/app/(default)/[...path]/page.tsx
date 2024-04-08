import { cache } from "react";
import { notFound } from "next/navigation";
import { log } from "next-axiom";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { fetchStaticInfo, fetchStaticInfoBySlug, pageTypeToUrl } from "@/sanity/static-info";

export const dynamicParams = false;

type Props = {
  params: {
    path: Array<string>;
  };
};

export async function generateStaticParams() {
  const pages = await fetchStaticInfo();
  return pages.map((page) => ({
    path: [pageTypeToUrl[page.pageType], page.slug],
  }));
}

const getData = cache(async (path: Props["params"]["path"]) => {
  const page = await fetchStaticInfoBySlug(path[0]!, path[1]!);

  if (!page) {
    log.info("Page not found", {
      path: path.join("/"),
    });
    return notFound();
  }

  return page;
});

export async function generateMetadata({ params }: Props) {
  const page = await getData(params.path);

  return {
    title: page.title,
  };
}

export default async function StaticPage({ params }: Props) {
  const page = await getData(params.path);

  return (
    <Container className="py-10">
      <article>
        <Heading className="mb-4">{page.title}</Heading>

        <Markdown content={page.body} />
      </article>
    </Container>
  );
}
