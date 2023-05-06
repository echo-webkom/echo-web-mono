import Container from "@/components/container";
import Markdown from "@/components/markdown";
import Heading from "@/components/ui/heading";
import {fetchBedpresBySlug} from "@/sanity/bedpres";

export default async function BedpresPage({params}: {params: {slug: string}}) {
  const bedpres = await fetchBedpresBySlug(params.slug);

  return (
    <Container>
      <div>
        <Heading>{bedpres.title}</Heading>
        <article>
          <Markdown content={bedpres.body ?? "## Mer informasjon kommer!"} />
        </article>
      </div>
    </Container>
  );
}
