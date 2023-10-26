import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { fetchBedpresBySlug } from "@/sanity/bedpres";
import { shortDate } from "@/utils/date";
import { BedpresSidebar } from "./bedpres-sidebar";

type Props = {
  params: {
    slug: string;
  };
};

async function getData(slug: string) {
  const bedpres = await fetchBedpresBySlug(slug);

  if (!bedpres) {
    return notFound();
  }

  return bedpres;
}

export const generateMetadata = async ({ params }: Props) => {
  const bedpres = await getData(params.slug);

  return {
    title: bedpres.title,
  };
};

export default async function BedpresPage({ params }: Props) {
  const bedpres = await getData(params.slug);

  return (
    <Container className="w-full md:max-w-[700px] lg:max-w-[1500px]">
      <div className="flex flex-col gap-8 lg:flex-row">
        <BedpresSidebar slug={params.slug} bedpres={bedpres} />

        {/* Content */}
        <article className="w-full">
          <Heading>{bedpres.title}</Heading>

          {bedpres.body ? (
            <Markdown content={bedpres.body} />
          ) : (
            <div className="mx-auto flex w-fit flex-col gap-8 p-5">
              <h3 className="text-center text-xl font-medium">Mer informasjon kommer!</h3>
              <Image
                className="rounded-lg"
                src="/gif/wallace-construction.gif"
                alt="Wallace hammering"
                width={400}
                height={400}
              />
            </div>
          )}
        </article>
      </div>

      <div className="pt-10 text-center text-muted-foreground lg:mt-auto">
        <Text size="sm" className="p-0">
          Publisert: {shortDate(bedpres._createdAt)}
        </Text>
        <Text size="sm" className="p-0">
          Sist oppdatert: {shortDate(bedpres._updatedAt)}
        </Text>
      </div>
    </Container>
  );
}
