import { kv } from "@vercel/kv";
import { format, isDate } from "date-fns";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { RequestChart } from "./_components/requests-chart";
import { Toolbar } from "./_components/toolbar";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: {
    date?: string;
  };
};

const parseDate = (date: string | undefined) => {
  if (!date) {
    return new Date();
  }

  const d = new Date(`${date}T00:00:00`);

  if (isDate(new Date(d))) {
    return new Date(d);
  }

  return new Date();
};

export default async function SanityRequestOverview({ searchParams }: Props) {
  const date = parseDate(searchParams.date);

  const queries = await kv.lrange<{
    query: string;
    params: Record<string, unknown>;
    date: Date;
  }>(`requests:${format(date, "yyyy-MM-dd")}`, 0, -1);

  return (
    <Container>
      <Heading>Sanity Requests</Heading>

      <Text>Oversikt over alle queries kjørt av vår proxy</Text>

      <Toolbar />

      {queries.length === 0 ? (
        <Text>Det er ingen queries kjørt for denne datoen</Text>
      ) : (
        <RequestChart data={queries} />
      )}
    </Container>
  );
}
