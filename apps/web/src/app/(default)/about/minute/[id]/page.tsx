import {type Metadata} from "next";

import Container from "@/components/container";
import {Button} from "@/components/ui/button";
import Heading from "@/components/ui/heading";
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
  const {title} = await getData(params.id);
  return {
    title,
  };
}

export default async function MinutePage({params}: Props) {
  const minute = await getData(params.id);

  return (
    <Container>
      <Heading>{minute.title}</Heading>

      <div className="flex flex-col gap-5">
        <Button className="w-full md:w-fit" asChild>
          <a href={minute.document}>Last ned</a>
        </Button>

        <iframe title={minute.title} src={minute.document} className="h-screen w-full" />
      </div>
    </Container>
  );
}
