import { cache } from "react";
import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";
import { fetchHeader } from "@/sanity/header";
import { fetchStaticInfo, fetchStaticInfoBySlug } from "@/sanity/static-info";
import { pageTypeToUrl } from "@/sanity/utils/mappers";

export const dynamicParams = false;

type Props = {
  params: Promise<{
    path: Array<string>;
  }>;
};

export const generateStaticParams = async () => {
  const pages = await fetchStaticInfo();
  return pages.map((page) => ({
    path: [pageTypeToUrl[page.pageType], page.slug],
  }));
};

const getData = cache(async (path: Array<string>) => {
  const page = await fetchStaticInfoBySlug(path[0]!, path[1]!);

  if (!page) {
    return notFound();
  }

  return page;
});

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { path } = await props.params;
  const page = await getData(path);
  return {
    title: page.title,
  };
};

export default async function StaticPage(props: Props) {
  const params = await props.params;
  const page = await getData(params.path);
  const header = await fetchHeader();

  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar header={header} />

      <article>
        <Heading className="mb-4">{page.title}</Heading>

        <Markdown content={page.body} />
      </article>
    </Container>
  );
}
