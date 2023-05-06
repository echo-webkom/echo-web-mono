import Container from "@/components/container";
import Markdown from "@/components/markdown";
import Heading from "@/components/ui/heading";
import {fetchJobAdBySlug} from "@/sanity/job-ad";

export default async function JobAdPage({params}: {params: {slug: string}}) {
  const jobAd = await fetchJobAdBySlug(params.slug);

  return (
    <Container>
      <article className="flex flex-col gap-10">
        <Heading>{jobAd.title}</Heading>

        <Markdown content={jobAd.body} />
      </article>
    </Container>
  );
}
