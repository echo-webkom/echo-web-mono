import { type Metadata } from "next";
import Image from "next/image";

import { unoWithAdmin } from "@/api/server";
import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { shuffle } from "@/utils/list";

export const metadata: Metadata = {
  title: "Søkere til Hovedstyret 2026/2027",
};

export default async function HSApplicationsPage() {
  const applications = await unoWithAdmin.sanity.hsApplications.all();
  const shuffled = shuffle(applications);

  return (
    <Container layout="larger">
      <Heading className="mt-10 mb-6 text-center">Søkere til Hovedstyret</Heading>

      <div className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {shuffled.map((application) => {
          const poster = application.poster;

          if (!poster) {
            return null;
          }

          if (poster.endsWith(".pdf")) {
            return null;
          }

          return (
            <div key={application.profile._id}>
              <a href={poster}>
                <Image src={poster} alt={application.profile.name} width={300} height={300} />
              </a>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
