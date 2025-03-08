import { cache } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { urlFor } from "@echo-webkom/sanity";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { fetchMerchBySlug } from "@/sanity/merch";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const getData = cache(async (slug: string) => {
  const merch = await fetchMerchBySlug(slug);

  if (!merch) {
    return notFound();
  }

  return merch;
});

export const generateMetadata = async (props: Props) => {
  const params = await props.params;
  const merch = await getData(params.slug);

  return {
    title: merch.title,
  };
};

export default async function MerchPage(props: Props) {
  const params = await props.params;
  const merch = await getData(params.slug);

  return (
    <Container className="mx-auto max-w-4xl space-y-5 px-6 py-10">
      <Heading className="text-3xl font-bold">{merch.title}</Heading>
      {merch.body && (
        <div>
          <Heading className="mb-2 text-lg font-semibold">Beskrivelse</Heading>
          <Markdown content={merch.body} />
        </div>
      )}

      <div className="flex max-w-52 items-center justify-between">
        <Text className="text-xl font-semibold">Pris: {merch.price} kr</Text>
        <Button variant="outline">Kjøp</Button>
      </div>

      <Image
        src={urlFor(merch.image).url()}
        alt={merch.title}
        width={700}
        height={475}
        className="rounded-lg border-2 shadow-lg"
      />
    </Container>
  );
}
