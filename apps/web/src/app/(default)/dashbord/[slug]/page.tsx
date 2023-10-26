import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type Group, type Registration, type User } from "@echo-webkom/db/schemas";
import { registrationStatusToString } from "@echo-webkom/lib";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Button } from "@/components/ui/button";
import { getHappeningBySlug } from "@/lib/queries/happening";
import { cn } from "@/utils/cn";

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

  const registered = registrations.filter((registration) => registration.status === "registered");
  const waitlist = registrations.filter((registration) => registration.status === "waiting");
  const unregistered = registrations.filter(
    (registration) => registration.status === "unregistered",
  );
  const removed = registrations.filter((registration) => registration.status === "removed");

  return (
    <Container className="flex flex-col gap-10">
      <Heading>
        Dashboard:{" "}
        <Link className="hover:underline" href={"/event/" + slug}>
          {happening.title}
        </Link>
      </Heading>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border px-3 py-8 text-center">
          <p>Antall påmeldte</p>
          <p className="text-7xl">{registered.length}</p>
        </div>

        <div className="rounded-xl border px-3 py-8 text-center">
          <p>Antatall på venteliste</p>
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
        <h2 className="text-3xl font-semibold">Registrerte</h2>
        <RegistrationTable registrations={registrations} />
      </div>
    </Container>
  );
}

type RegistrationWithUser = Omit<Registration, "userId"> & {
  user: User & {
    memberships: Array<{
      group: Group | null;
    }>;
  };
};

function RegistrationTable({ registrations }: { registrations: Array<RegistrationWithUser> }) {
  if (registrations.length === 0) {
    return <p className="text-center md:text-left">Ingen registrerte</p>;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="bg-gray-200 text-xs uppercase">
          <tr>
            <th scope="col" className="px-6 py-4 text-left">
              Navn
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              E-post
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              Status
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              Grunn
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              Undergrupper
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              Handling
            </th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration, i) => (
            <RegistrationRow key={registration.user.id} registration={registration} index={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const RegistrationRow = ({
  registration,
  index,
}: {
  registration: RegistrationWithUser;
  index: number;
}) => {
  const email = registration.user.alternativeEmail ?? registration.user.email ?? "";

  return (
    <tr
      key={registration.user.id}
      className={cn("border-b", {
        "bg-white": index % 2 === 0,
      })}
    >
      <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium">
        {registration.user.name}
      </th>
      <td className="px-6 py-4">
        <Link className="hover:underline" href={"mailto:" + email}>
          {email}
        </Link>
      </td>
      <td className="px-6 py-4">{registrationStatusToString[registration.status]}</td>
      <td className="px-6 py-4">{registration.unregisterReason}</td>
      <td className="px-6 py-4">
        {registration.user.memberships.map((membership) => membership.group?.name).join(", ")}
        {registration.user.memberships.length === 0 && "Ingen"}
      </td>
      <td className="px-6 py-4">
        <Button>Endre</Button>
      </td>
    </tr>
  );
};
