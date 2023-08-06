import {notFound} from "next/navigation";

import {Container} from "@/components/container";
import {Markdown} from "@/components/markdown";
import {Heading} from "@/components/ui/heading";
import {fetchStaticInfoBySlug, fetchStaticInfoPaths} from "@/sanity/static-info";

type Props = {
  params: {
    type: string;
    slug: string;
  };
};

const getData = async (slug: string) => {
  const page = await fetchStaticInfoBySlug(slug);

  if (!page) {
    return notFound();
  }

  return page;
};

export const generateStaticParams = async () => {
  return await fetchStaticInfoPaths();
};

export const generateMetadata = async ({params}: Props) => {
  const page = await getData(params.slug);

  return {
    title: page.title,
  };
};

export default async function StaticPage({params}: Props) {
  const page = await getData(params.slug);

  return (
    <Container>
      <article>
        <Heading>{page.title}</Heading>

        <Markdown content={page.body} />
      </article>
    </Container>
  );
}
