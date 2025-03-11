import { type Metadata } from "next";
import { unstable_cache } from "next/cache";
import Image from "next/image";

import { type AllHsApplicationsResult } from "@echo-webkom/cms/types";
import { cdnClient } from "@echo-webkom/sanity";
import { allHsApplications } from "@echo-webkom/sanity/queries";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { shuffle } from "@/utils/list";

const fetchAllHsApplications = () => {
  return unstable_cache(
    async () => {
      return await cdnClient.fetch<AllHsApplicationsResult>(allHsApplications);
    },
    ["applications"],
    {
      revalidate: 3600,
    },
  )();
};

export const metadata = {
  title: "Søkere til Hovedstyret 2025/2026",
} satisfies Metadata;

export default async function HSApplicationsPage() {
  const applications = await fetchAllHsApplications();
  const shuffled = shuffle(applications);

  return (
    <Container layout="larger">
      <Heading className="mb-4 mt-8">Søkere til Hovedstyret</Heading>

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
