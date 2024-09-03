import { unstable_cache } from "next/cache";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { ensureWebkom } from "@/lib/ensure";
import { RevalidateCacheInput } from "./_components/revalidate-cache-box";

const getTime = unstable_cache(
  () => {
    return Promise.resolve(Date.now());
  },
  ["time"],
  {
    tags: ["time"],
  },
);

export default async function AdminGroupsPage() {
  await ensureWebkom();

  const time = await getTime();

  return (
    <Container>
      <Heading className="mb-4">Cache</Heading>

      <Text className="mb-2">Her kan du administrere cachen på siden.</Text>

      <Text className="mb-8">
        Cachet tid: {time}. Bruk <code>time</code> for å revalidere tiden. Dette er en sanity check
        om du tror noe ikke funker.
      </Text>

      <RevalidateCacheInput />
    </Container>
  );
}
