import Link from "next/link";
import {notFound} from "next/navigation";

import {prisma} from "@echo-webkom/db/client";
import {type Prisma} from "@echo-webkom/db/types";
import {groupToString, registrationStatusToString} from "@echo-webkom/lib";

import Container from "@/components/container";
import {Button} from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import {getHappeningBySlug} from "@/lib/queries/happening";
import {cn} from "@/utils/cn";

interface Props {
  params: {
    slug: string;
  };
}

export default async function EventDashboard({params}: Props) {
  const {slug} = params;

  const eventInfo = await getHappeningBySlug(slug);

  if (!eventInfo) {
    return notFound();
  }

  const rows = await prisma.registration.findMany({
    where: {
      happeningSlug: slug,
    },
    include: {
      user: true,
    },
  });

  const registered = rows.filter((registration) => registration.status === "REGISTERED");
  const waitlist = rows.filter((registration) => registration.status === "WAITLISTED");
  const deregistered = rows.filter((registration) => registration.status === "DEREGISTERED");

  const registrations = [...registered, ...waitlist, ...deregistered];

  return (
    <Container className="flex flex-col gap-10">
      <Heading>
        Dashboard:{" "}
        <Link className="hover:underline" href={"/event/" + slug}>
          {eventInfo.title}
        </Link>
      </Heading>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
          <p className="text-7xl">{deregistered.length}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold">Registrerte</h2>
        <RegistrationTable registrations={registrations} />
      </div>
    </Container>
  );
}

type RegistrationWithUser = Prisma.RegistrationGetPayload<{
  include: {user: true};
}>;

function RegistrationTable({registrations}: {registrations: RegistrationWithUser[]}) {
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
            <RegistrationRow key={registration.userId} registration={registration} index={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RegistrationRow({
  registration,
  index,
}: {
  registration: RegistrationWithUser;
  index: number;
}) {
  const email = registration.user.alternativeEmail ?? registration.user.email ?? "";

  return (
    <tr
      key={registration.userId}
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
      <td className="px-6 py-4">{registration.reason}</td>
      <td className="px-6 py-4">
        {registration.user.studentGroups.map((group) => groupToString[group]).join(", ")}
        {registration.user.studentGroups.length === 0 && "Ingen"}
      </td>
      <td className="px-6 py-4">
        <Button>Endre</Button>
      </td>
    </tr>
  );
}
