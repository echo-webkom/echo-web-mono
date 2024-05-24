import { cache } from "react";
import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Button } from "@/components/ui/button";
import { fetchMinuteById } from "@/sanity/minutes/requests";

type Props = {
  params: {
    id: string;
  };
};

const getData = cache(async (id: string) => {
  const minute = await fetchMinuteById(id);

  if (!minute) {
    return notFound();
  }

  return minute;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title } = await getData(params.id);
  return {
    title,
  };
}

export default async function MinutePage({ params }: Props) {
  const minute = await getData(params.id);

  return (
    <Container className="py-10">
      <Heading className="mb-4">{minute.title}</Heading>

      <div className="flex flex-col gap-5">
        {minute.document && (
          <Button className="w-full md:w-fit" asChild>
            <a href={minute.document}>Last ned</a>
          </Button>
        )}

        {minute.document ? (
          <iframe title={minute.title} src={minute.document} className="h-screen w-full" />
        ) : (
          <p>Ingen dokumenter tilgjengelig</p>
        )}
      </div>
    </Container>
  );
}
