import { cache } from "react";
import { notFound } from "next/navigation";

import { unoWithAdmin } from "@/api/server";
import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { pageTypeToUrl } from "@/lib/mappers";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";

export const dynamicParams = false;

type Props = {
  params: Promise<{
    path: Array<string>;
  }>;
};

export const generateStaticParams = async () => {
  const pages = await unoWithAdmin.sanity.staticInfo.all().catch(() => []);
  return pages.map((page) => ({
    path: [pageTypeToUrl[page.pageType], page.slug],
  }));
};

const getData = cache(async (path: Array<string>) => {
  const slug = path[1]!;
  const page = slug ? await unoWithAdmin.sanity.staticInfo.bySlug(slug).catch(() => null) : null;

  if (!page) {
    return notFound();
  }

  return page;
});

export const generateMetadata = async (props: Props) => {
  const { path } = await props.params;
  const page = await getData(path);
  return {
    title: page.title,
  };
};

export default async function StaticPage(props: Props) {
  const params = await props.params;
  const page = await getData(params.path);

  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar />

      <article>
        <Heading className="mb-4">{page.title}</Heading>

        <Markdown content={page.body} />
      </article>
    </Container>
  );
}
