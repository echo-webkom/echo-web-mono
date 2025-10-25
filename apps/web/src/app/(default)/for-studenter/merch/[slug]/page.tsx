import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { urlFor } from "@echo-webkom/sanity";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
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

export const generateMetadata = async (props: Props): Promise<Metadata> => {
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
    <Container className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Column */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2">
          <Image
            src={urlFor(merch.image).width(800).height(800).fit("crop").url()}
            alt={merch.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content Column */}
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <Heading className="text-3xl font-bold">{merch.title}</Heading>
            <Text className="text-muted-foreground text-2xl font-semibold">{merch.price} kr</Text>
          </div>

          {merch.body && (
            <div className="space-y-3">
              <Markdown content={merch.body} />
            </div>
          )}

          <div className="rounded-lg border-2 bg-slate-50 p-6 dark:bg-slate-900">
            <Text className="text-base">
              Send mail til <span className="font-semibold underline">echo@uib.no</span> for kjøp
            </Text>
          </div>
        </div>
      </div>
    </Container>
  );
}
