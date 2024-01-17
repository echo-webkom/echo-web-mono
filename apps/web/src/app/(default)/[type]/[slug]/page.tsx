import { cache } from "react";
import { type Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { happeningTypeToPathname } from "@echo-webkom/lib";

import { Container } from "@/components/container";
import { HappeningSidebar } from "@/components/happening-sidebar";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { fetchHappeningBySlug } from "@/sanity/happening/requests";
import { shortDate } from "@/utils/date";

type Props = {
  params: {
    type: string;
    slug: string;
  };
};

export const dynamicParams = false;

const getData = cache(async ({ params }: Props) => {
  const happening = await fetchHappeningBySlug(params.slug);

  if (!happening || happeningTypeToPathname[happening.happeningType] !== params.type) {
    return notFound();
  }

  return happening;
});

export async function generateMetadata({ params }: Props) {
  const happening = await getData({ params });

  return {
    title: happening.title,
    keywords: ["echo", "universitetet i bergen", "studentforening", "student", "arrangement"],
  } satisfies Metadata;
}

export default async function EventPage({ params }: Props) {
  const happening = await getData({ params });

  return (
    <Container className="w-full md:max-w-[700px] lg:max-w-[1500px]">
      <div className="flex flex-col gap-8 lg:flex-row">
        <HappeningSidebar sHappening={happening} />

        {/* Content */}
        <article className="w-full">
          <Heading>{happening.title}</Heading>

          {happening.body ? (
            <Markdown content={happening.body} />
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
          Publisert: {shortDate(happening._createdAt)}
        </Text>
        <Text size="sm" className="p-0">
          Sist oppdatert: {shortDate(happening._updatedAt)}
        </Text>
      </div>
    </Container>
  );
}
