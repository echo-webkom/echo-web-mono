import {
  happeningTypeToPath,
  happeningTypeToString,
  registrationStatusToString,
} from "@echo-webkom/lib";
import Link from "next/link";
import { redirect } from "next/navigation";

import { unoWithAdmin } from "@/api/server";
import { type RegistrationStatus, type UnoReturnType } from "@/api/uno/client";
import { auth } from "@/auth/session";
import { Heading } from "@/components/typography/heading";
import { shortDateNoTime } from "@/utils/date";

import { cn } from "../../../../../../utils/cn";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserHappenings({ params }: Props) {
  const user = await auth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  const pageUserId = (await params).id;

  if (user.id !== pageUserId) {
    return redirect("/hjem");
  }

  const registrations = await unoWithAdmin.users.registrationsByUserId(user.id);

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
      <Heading level={2} className="mb-4 text-3xl">
        Dine arrangementer
      </Heading>
      <div>
        <Heading level={3} className="mt-14 pb-6 font-semibold">
          Kommende arrangementer
        </Heading>
        {futureRegistrations.length > 0 ? (
          <EventCards registrations={futureRegistrations} />
        ) : (
          <p className="text-muted-foreground">Du er ikke påmeldt noen kommende arrangementer.</p>
        )}
      </div>
      <div>
        <Heading level={3} className="mt-14 pb-6 font-semibold">
          Tidligere arrangementer
        </Heading>
        {pastRegistrations.length > 0 ? (
          <EventCards registrations={pastRegistrations} />
        ) : (
          <p className="text-muted-foreground">Du har ingen tidligere arrangementer.</p>
        )}
      </div>
    </div>
  );
}

type Registrations = UnoReturnType["users"]["registrationsByUserId"];

function EventCards({
  registrations,
}: {
  registrations: Registrations;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        {registrations.map((registration) => (
          <Link
            href={
              happeningTypeToPath[registration.happening.type] + "/" + registration.happening.slug
            }
            key={registration.happening.slug}
            className="hover:bg-muted bg-accent grid grid-cols-3 rounded-md border p-4"
          >
            <div className="col-span-2 flex flex-col gap-2">
              <h1 className="line-clamp-1 overflow-hidden font-bold">
                {registration.happening.title}
              </h1>
              <div className="text-muted-foreground flex gap-2 text-sm">
                <p className="">{happeningTypeToString[registration.happening.type]}</p>
                {registration.happening.date && (
                  <>
                    <p>|</p>
                    <p>{shortDateNoTime(registration.happening.date)}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <p
                className={cn("text-xs font-bold", registrationStatusToColor[registration.status])}
              >
                {registrationStatusToString[registration.status].toUpperCase()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

const registrationStatusToColor: Record<RegistrationStatus, string> = {
  registered: "text-emerald-400",
  waiting: "text-amber-400",
  unregistered: "text-rose-500",
  removed: "text-rose-500",
  pending: "text-amber-400",
};

//export type RegistrationStatus = "registered" | "unregistered" | "removed" | "waiting" | "pending";
