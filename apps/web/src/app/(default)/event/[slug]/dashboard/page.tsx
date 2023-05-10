import Link from "next/link";
import {redirect} from "next/navigation";

import {prisma} from "@echo-webkom/db/client";
import {getHappeningBySlug} from "@echo-webkom/db/queries/happening";
import {getUserById} from "@echo-webkom/db/queries/user";
import {type Prisma} from "@echo-webkom/db/types";
import {groupToString, registrationStatusToString} from "@echo-webkom/lib";

import Container from "@/components/container";
import Heading from "@/components/ui/heading";
import {isEventOrganizer} from "@/lib/happening";
import {getServerSession} from "@/lib/session";
import {cn} from "@/utils/cn";

type Props = {
  params: {
    slug: string;
  };
};

export default async function EventDashboard({params}: Props) {
  const {slug} = params;
  const session = await getServerSession();
  const user = await getUserById(session?.user.id ?? "");
  const eventInfo = await getHappeningBySlug(slug);

  if (!eventInfo || !user) {
    return redirect("/api/auth/signin");
  }

  if (!isEventOrganizer(eventInfo, user)) {
    return redirect("/api/auth/signin");
  }

  const dbRegistrations = await prisma.registration.findMany({
    where: {
      happeningSlug: slug,
    },
    include: {
      user: true,
    },
  });

  const registered = dbRegistrations.filter((registration) => registration.status === "REGISTERED");
  const waitlist = dbRegistrations.filter((registration) => registration.status === "WAITLISTED");
  const deregistered = dbRegistrations.filter(
    (registration) => registration.status === "DEREGISTERED",
  );

  const registrations = [...registered, ...waitlist, ...deregistered];

  return (
    <Container className="flex flex-col gap-10">
      <Heading>
        Dashboard:{" "}
        <Link className="hover:underline" href={"/event/" + slug}>
          {eventInfo.title}
        </Link>
      </Heading>

      <div className="flex flex-col gap-3">
        <div>
          <span className="font-semibold">Antall påmeldte:</span> <span>{registered.length}</span>
        </div>
        <div>
          <span className="font-semibold">Antall på venteliste:</span>{" "}
          <span>{waitlist.length}</span>
        </div>
        <div>
          <span className="font-semibold">Antall avmeldt:</span> <span>{deregistered.length}</span>
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

function RegistrationTable({registrations}: {registrations: Array<RegistrationWithUser>}) {
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
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration, i) => (
            <tr
              key={registration.userId}
              className={cn("border-b", {
                "bg-white": i % 2 === 0,
              })}
            >
              <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium">
                {registration.user.name}
              </th>
              <td className="px-6 py-4">{registration.user.email}</td>
              <td className="px-6 py-4">{registrationStatusToString[registration.status]}</td>
              <td className="px-6 py-4">{registration.reason}</td>
              <td className="px-6 py-4">
                {registration.user.studentGroups.map((group) => groupToString[group]).join(", ")}
                {registration.user.studentGroups.length === 0 && "Ingen"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
