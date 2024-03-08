import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@echo-webkom/auth";
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
        !registration.happening.date || new Date(registration.happening.date) < new Date(),
    );
  const futureRegistrations = registrations
    .slice()
    .reverse()
    .filter(
      (registration) =>
        registration.happening.date && new Date(registration.happening.date) >= new Date(),
    );

  return (
    <div className="max-w-2xl">
      <Heading level={2} className="mb-4">
        Dine arrangementer
      </Heading>
      {registrations.length > 0 ? (
        <div className="w-fit">
          <Heading level={3} className="mt-14 pb-5 font-semibold">
            Kommende arrangementer
          </Heading>
          <div className="flex flex-col">
            {futureRegistrations.map((registration) => (
              <Link
                href={
                  happeningTypeToPath[registration.happening.type] +
                  "/" +
                  registration.happening.slug
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
          <Heading level={3} className="mt-14 pb-5 font-semibold">
            Tidligere arrangementer
          </Heading>
          <div className="flex flex-col">
            {pastRegistrations.map((registration) => (
              <Link
                href={
                  happeningTypeToPath[registration.happening.type] +
                  "/" +
                  registration.happening.slug
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
        </div>
      ) : (
        <p>Du er ikke påmeldt noen arrangementer.</p>
      )}
    </div>
  );
}
