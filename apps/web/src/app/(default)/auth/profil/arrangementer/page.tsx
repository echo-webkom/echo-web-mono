import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@echo-webkom/auth";
import type { Happening } from "@echo-webkom/db/schemas";
import {
  happeningTypeToPath,
  happeningTypeToString,
  registrationStatusToString,
} from "@echo-webkom/lib";

import { Chip } from "@/components/typography/chip";
import { Heading } from "@/components/typography/heading";
import { getRegistrationsByUserId } from "@/data/registrations/queries";
import { shortDateNoTime } from "@/utils/date";

export default async function UserHappenings() {
  const user = await auth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }
  const registrations = await getRegistrationsByUserId(user.id);

  const pastRegistrations = registrations
    .slice()
    .reverse()
    .filter(
      (registration) =>
        !registration.happening.date ||
        (new Date(registration.happening.date) < new Date() &&
          registration.status !== "unregistered"),
    );

  const futureRegistrations = registrations
    .slice()
    .reverse()
    .filter(
      (registration) =>
        registration.happening.date &&
        new Date(registration.happening.date) >= new Date() &&
        registration.status !== "unregistered",
    );

  return (
    <div className="max-w-2xl">
      <Heading level={2} className="mb-4">
        Dine arrangementer
      </Heading>
      <div>
        <Heading level={3} className="mt-14 pb-6 font-semibold">
          Kommende arrangement
        </Heading>
        {futureRegistrations.length > 0 ? (
          <EventCards registrations={futureRegistrations} />
        ) : (
          <p>Du er ikke påmeldt noen kommende arrangementer.</p>
        )}
      </div>
      <div>
        <Heading level={3} className="mt-14 pb-6 font-semibold">
          Tidligere arrangement
        </Heading>
        {pastRegistrations.length > 0 ? (
          <EventCards registrations={pastRegistrations} />
        ) : (
          <p>Du har ingen tidligere arrangementer.</p>
        )}
      </div>
    </div>
  );
}

function EventCards<
  TRegistration extends {
    happening: Happening;
    status: "registered" | "unregistered" | "removed" | "waiting" | "pending";
  },
>({ registrations }: { registrations: Array<TRegistration>; children?: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col">
        {registrations.map((registration) => (
          <Link
            href={
              happeningTypeToPath[registration.happening.type] + "/" + registration.happening.slug
            }
            key={registration.happening.slug}
            className="rounded-md p-4 hover:bg-muted"
          >
            <h1 className="my-auto line-clamp-1 overflow-hidden text-lg sm:text-2xl">
              {registration.happening.title}
            </h1>
            {registration.happening.date && (
              <p className="text-sm text-muted-foreground">
                {shortDateNoTime(registration.happening.date)}
              </p>
            )}
            <div className="mt-3 flex gap-1">
              <Chip>{happeningTypeToString[registration.happening.type]}</Chip>
              <Chip>{registrationStatusToString[registration.status]}</Chip>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
