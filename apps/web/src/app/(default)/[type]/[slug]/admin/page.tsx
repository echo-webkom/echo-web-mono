import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { LuChevronLeft as ChevronLeft } from "react-icons/lu";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { happeningTypeToPathname } from "@echo-webkom/lib";

import { Container } from "@/components/container";
import { HappeningInfoBox } from "@/components/happening-info-box";
import { RegistrationTable } from "@/components/registration-table";
import { isHost } from "@/lib/is-host";
import { getStudentGroups } from "@/lib/queries/student-groups";

type Props = {
  params: {
    type: string;
    slug: string;
  };
};

const getRegistrationsStmt = db.query.registrations
  .findMany({
    where: (registration) => eq(registration.happeningId, sql.placeholder("id")),
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
  })
  .prepare("getRegistrations");

const getHappeningStmt = db.query.happenings
  .findFirst({
    where: (happening) => eq(happening.slug, sql.placeholder("slug")),
    with: {
      questions: true,
      groups: {
        with: {
          group: true,
        },
      },
    },
  })
  .prepare("getHappening");

async function getData(params: Props["params"]) {
  const happening = await getHappeningStmt.execute({
    slug: params.slug,
  });

  if (!happening || happeningTypeToPathname[happening.type] !== params.type) {
    return notFound();
  }

  const [registrations, studentGroups] = await Promise.all([
    getRegistrationsStmt.execute({
      id: happening.id,
    }),
    getStudentGroups(),
  ]);

  return {
    happening,
    registrations,
    studentGroups,
  };
}

export default async function HappeningDashboard({ params }: Props) {
  const { happening, registrations, studentGroups } = await getData(params);

  const user = await auth();

  if (!user || !isHost(user, happening)) {
    return notFound();
  }

  const registered = registrations.filter((registration) => registration.status === "registered");
  const waitlist = registrations.filter((registration) => registration.status === "waiting");
  const unregistered = registrations.filter(
    (registration) => registration.status === "unregistered",
  );
  const removed = registrations.filter((registration) => registration.status === "removed");

  return (
    <Container className="flex flex-col gap-10">
      <div className="m-2">
        <Link href={`/${happeningTypeToPathname[happening.type]}/${happening.slug}`}>
          <ChevronLeft className="mr-2 inline-block h-6 w-6" />
          <span className="underline">Tilbake</span>
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
        <HappeningInfoBox happeningId={happening.id} />
      </div>
      {registrations.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold">Registrerte</h2>
          <RegistrationTable registrations={registrations} studentGroups={studentGroups} />
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
