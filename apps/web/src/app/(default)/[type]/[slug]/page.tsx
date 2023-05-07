import Container from "@/components/container";
import Markdown from "@/components/markdown";
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
        <h1 className="mb-3 text-4xl font-bold md:text-6xl">{page.title}</h1>

        <Markdown content={page.body} />
      </article>
    </Container>
  );
}
