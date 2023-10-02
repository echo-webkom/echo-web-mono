import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, type InferSelectModel } from "drizzle-orm";

import { groupToString, registrationStatusToString } from "@echo-webkom/lib";
import {
  db,
  getHappening,
  type registrations,
  type userGroupMemberships,
  type users,
} from "@echo-webkom/storage";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/utils/cn";

type Props = {
  params: {
    slug: string;
  };
};

export default async function EventDashboard({ params }: Props) {
  const { slug } = params;

  const happening = await getHappening(slug);

  if (!happening) {
    return notFound();
  }

  const registrations = await db.query.registrations.findMany({
    where: (r) => eq(r.happeningSlug, slug),
    with: {
      user: {
        with: {
          groups: true,
        },
      },
    },
  });

  const registered = registrations.filter((registration) => registration.status === "registered");
  const waitlist = registrations.filter((registration) => registration.status === "waiting");
  const deregistered = registrations.filter(
    (registration) => registration.status === "unregistered",
  );

  return (
    <Container className="flex flex-col gap-10">
      <Heading>
        Dashboard:{" "}
        <Link className="hover:underline" href={"/event/" + slug}>
          {happening.title}
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
        <RegistrationTable rs={registrations} />
      </div>
    </Container>
  );
}

type RegistrationWithUser = InferSelectModel<typeof registrations> & {
  user: InferSelectModel<typeof users> & {
    groups: Array<InferSelectModel<typeof userGroupMemberships>>;
  };
};

function RegistrationTable({ rs }: { rs: Array<RegistrationWithUser> }) {
  if (rs.length === 0) {
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
          {rs.map((registration, i) => (
            <RegistrationRow key={registration.id} registration={registration} index={i} />
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
  return (
    <tr
      key={registration.userId}
      className={cn("border-b", {
        "bg-white": index % 2 === 0,
      })}
    >
      <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium">
        {registration.user.firstName} {registration.user.lastName}
      </th>
      <td className="px-6 py-4">
        <Link className="hover:underline" href={"mailto:" + registration.user.email}>
          {registration.user.email}
        </Link>
      </td>
      <td className="px-6 py-4">{registrationStatusToString[registration.status]}</td>
      <td className="px-6 py-4">TODO GRUNN</td>
      <td className="px-6 py-4">
        {registration.user.groups.map((group) => groupToString[group.id]).join(", ")}
        {registration.user.groups.length === 0 && "Ingen"}
      </td>
      <td className="px-6 py-4">
        <Button>Endre</Button>
      </td>
    </tr>
  );
};
