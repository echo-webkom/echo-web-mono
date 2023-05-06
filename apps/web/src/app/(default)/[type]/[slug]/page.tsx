import Container from "@/components/container";
import Markdown from "@/components/markdown";
import Heading from "@/components/ui/heading";
import {fetchStaticInfoBySlug, fetchStaticInfoPaths} from "@/sanity/static-info";

export const dynamicParams = false;

export async function generateStaticParams() {
  return await fetchStaticInfoPaths();
}

export default async function StaticPage({params}: {params: {type: string; slug: string}}) {
  const page = await fetchStaticInfoBySlug(params.slug);

  return (
    <Container>
      <article>
        <Heading>{page.title}</Heading>

        <Markdown content={page.body} />
      </article>
    </Container>
  );
}
