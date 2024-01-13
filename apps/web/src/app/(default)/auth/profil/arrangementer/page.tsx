import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@echo-webkom/auth";
import {
  happeningTypeToPathname,
  happeningTypeToString,
  registrationStatusToString,
} from "@echo-webkom/lib";

import { Chip } from "@/components/typography/chip";
import { Heading } from "@/components/typography/heading";
import { getUserRegistrations } from "@/lib/queries/user";

export default async function UserHappenings() {
  const user = await auth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }
  const registrations = await getUserRegistrations(user.id);

  return (
    <div className="max-w-2xl">
      <Heading level={2} className="mb-4">
        Dine arrangementer
      </Heading>
      {registrations.length > 0 ? (
        <ul className="flex flex-col divide-y">
          {registrations.map((registration) => (
            <li key={registration.happening.slug}>
              <div className="py-3">
                <Link
                  href={`/${happeningTypeToPathname[registration.happening.type]}/${
                    registration.happening.slug
                  }/admin`}
                  className="text-lg font-semibold hover:underline"
                >
                  {registration.happening.title}
                </Link>

                <div className="mt-3 flex gap-1">
                  <Chip>{happeningTypeToString[registration.happening.type]}</Chip>
                  <Chip>{registrationStatusToString[registration.status]}</Chip>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Du er ikke påmeldt noen arrangementer.</p>
      )}
    </div>
  );
}
