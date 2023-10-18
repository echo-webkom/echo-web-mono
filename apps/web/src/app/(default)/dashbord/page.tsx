import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma, type Prisma } from "@echo-webkom/db";
import { groupToString, registrationStatusToString } from "@echo-webkom/lib";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { getHappeningBySlug } from "@/lib/queries/happening";

import { HappeningDashboardBox } from "@/components/happening-dashboard-box";
import { $fetchAllBedpresses, fetchUpcomingBedpresses } from "@/sanity/bedpres";
import { $fetchAllEvents } from "@/sanity/event";


type Props = {
  params: {
    slug: string;
  };
};

export default async function EventDashboard({}: Props) {
    const [events, bedpresses] = await Promise.all([
      $fetchAllEvents(),
      $fetchAllBedpresses()
    ]);

  return (
    <Container className="flex flex-col gap-10">
      <Heading>
        Dashboard:
      </Heading>

      <section className="flex flex-col gap-5 rounded-md border bg-background p-5 shadow-lg">
        <HappeningDashboardBox type="EVENT" happenings={events} />
      </section>

      {/* Bedpresses */}
      <section className="flex flex-col gap-5 rounded-md border bg-background p-5 shadow-lg">
        <HappeningDashboardBox type="BEDPRES" happenings={bedpresses} />
      </section>

      <div className="flex flex-col gap-3">
      </div>
    </Container>
  );
}

