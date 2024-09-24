import { cache } from "react";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { fetchStaticInfo, fetchStaticInfoBySlug } from "@/sanity/static-info";
import { pageTypeToUrl } from "@/sanity/utils/mappers";

export const dynamicParams = false;

type Props = {
  params: {
    path: Array<string>;
  };
};

export const generateStaticParams = async () => {
  const pages = await fetchStaticInfo();
  return pages.map((page) => ({
    path: [pageTypeToUrl[page.pageType], page.slug],
  }));
};

const getData = cache(async (path: Props["params"]["path"]) => {
  const page = await fetchStaticInfoBySlug(path[0]!, path[1]!);

  if (!page) {
    return notFound();
  }

  return page;
});

export const generateMetadata = async ({ params }: Props) => {
  const page = await getData(params.path);
  return {
    title: page.title,
  };
};

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
