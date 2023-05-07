import Container from "@/components/container";
import Markdown from "@/components/markdown";
import {fetchBedpresBySlug} from "@/sanity/bedpres";

export default async function BedpresPage({params}: {params: {slug: string}}) {
  const bedpres = await fetchBedpresBySlug(params.slug);

  return (
    <Container>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
        <article className="prose md:prose-xl lg:col-span-3">
          <h1>{bedpres.title}</h1>
          <Markdown content={bedpres.body ?? "## Mer informasjon kommer!"} />
        </article>
      </div>
    </Container>
  );
}
