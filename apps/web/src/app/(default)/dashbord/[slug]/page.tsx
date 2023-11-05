import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { HappeningInfoBox } from "@/components/happening-info-box";
import { RegistrationTable } from "@/components/registration-table";
import { getHappeningBySlug } from "@/lib/queries/happening";

type Props = {
  params: {
    slug: string;
  };
};

export default async function EventDashboard({ params }: Props) {
  const { slug } = params;

  const happening = await getHappeningBySlug(slug);

  if (!happening) {
    return notFound();
  }

  const registrations = await db.query.registrations.findMany({
    where: (registration) => eq(registration.happeningSlug, slug),
    with: {
      user: {
        with: {
          memberships: {
            with: {
              group: true,
            },
          },
        },
      },
    },
  });

  const happeningType = happening.type === "event" ? "arrangement" : "bedpres";

  const registered = registrations.filter((registration) => registration.status === "registered");
  const waitlist = registrations.filter((registration) => registration.status === "waiting");
  const unregistered = registrations.filter(
    (registration) => registration.status === "unregistered",
  );
  const removed = registrations.filter((registration) => registration.status === "removed");

  return (
    <Container className="flex flex-col gap-10">
      <div className="m-2">
        <Link href={`/${happeningType}/${happening.slug}`}>
          <span className="p-2">⇐</span>
          <span className="underline">Tilbake</span>
          {eventInfo.type === "BEDPRES" && " (Bedriftspresentasjon)"}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border px-3 py-8 text-center">
          <p>Antall påmeldte</p>

          <p className="text-7xl">{registered.length}</p>
        </div>

        <div className="rounded-xl border px-3 py-8 text-center">
          <p>Antall på venteliste</p>
          <p className="text-7xl">{waitlist.length}</p>
        </div>

        <div className="rounded-xl border px-3 py-8 text-center">
          <p>Antall avmeldt</p>
          <p className="text-7xl">{unregistered.length}</p>
        </div>

        <div className="rounded-xl border px-3 py-8 text-center">
          <p>Antall fjernet</p>
          <p className="text-7xl">{removed.length}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <HappeningInfoBox happening={happening} />
      </div>
      {registrations.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold">Registrerte</h2>
          <RegistrationTable registrations={registrations} />
        </div>
      ) : (
        <div className="mx-auto flex w-fit flex-col gap-8 p-5">
          <h3 className="text-center text-xl font-medium">Ingen registrerte!</h3>
          <Image
            className="rounded-lg"
            src="/gif/empty-shelves-john-travolta.gif"
            alt="Travolta looking around in an empty store"
            width={600}
            height={600}
          />
        </div>
      )}
    </Container>
  );
}
