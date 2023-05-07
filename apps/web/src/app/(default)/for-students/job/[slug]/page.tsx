import Container from "@/components/container";
import Markdown from "@/components/markdown";
import {fetchJobAdBySlug} from "@/sanity/job-ad";

export default async function JobAdPage({params}: {params: {slug: string}}) {
  const jobAd = await fetchJobAdBySlug(params.slug);

  return (
    <Container>
      <article className="flex flex-col gap-10">
        <h1 className="text-4xl font-bold md:text-6xl">{jobAd.title}</h1>

        <Markdown content={jobAd.body} />
      </article>
    </Container>
  );
}
