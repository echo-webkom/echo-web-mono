import {type Metadata} from "next";

import Container from "@/components/container";
import {fetchMinuteById, fetchMinuteParams} from "@/sanity/minutes";

export const dynamicParams = false;

type Props = {
  params: {
    id: string;
  };
};

async function getData(id: string) {
  return await fetchMinuteById(id);
}

export async function generateStaticParams() {
  return await fetchMinuteParams();
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const data = await getData(params.id);
  return {
    title: data.title,
  };
}

export default async function MinutePage({params}: Props) {
  const data = await getData(params.id);

  return (
    <Container>
      <h1>{data.title}</h1>
    </Container>
  );
}
