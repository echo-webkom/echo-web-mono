import Image from "next/image";

import { urlFor } from "@echo-webkom/sanity";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getAllUsers } from "@/data/users/queries";
import { ensureWebkomOrHovedstyret } from "@/lib/ensure";
import { fetchAllTrophies } from "@/sanity/trophies";
import { UserTrophiesModal } from "./usertrophies-modal";

export default async function TrophyPage() {
  await ensureWebkomOrHovedstyret();

  const trophies = await fetchAllTrophies();
  const [users] = await Promise.all([getAllUsers()]);

  if (!trophies) {
    return <p>Kunne ikke hente troféer.</p>;
  }

  return (
    <Container className="space-y-6">
      <Heading>Troféer</Heading>
      <Text>Her er det mulig å redigere hvem som fortjener alle troféene.</Text>

      {trophies.map((trophy) => (
        <div key={trophy._id}>
          <h3 className="my-3 text-xl font-semibold">{trophy.title}</h3>
          <div className="flex">
            {trophy.trophies && (
              <div className="flex gap-5">
                {trophy.trophies.map((t) => (
                  <div key={t._key} className="flex flex-col items-center gap-y-3">
                    <Image
                      src={urlFor(t.image ?? "").url()}
                      alt="Empty trophy"
                      width={150}
                      height={150}
                    />
                    <UserTrophiesModal users={users} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </Container>
  );
}
