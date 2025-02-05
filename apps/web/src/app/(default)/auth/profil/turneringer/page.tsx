import Link from "next/link";
import { redirect } from "next/navigation";

import { Heading } from "@/components/typography/heading";
import { getUser } from "@/lib/get-user";

export default async function UserHappenings() {
  const user = await getUser();

  if (!user) {
    return redirect("/auth/logg-inn");
  }
  //   const registrations = await getRegistrationsByUserId(user.id);
  //   const futureRegistrations = registrations
  //     .slice()
  //     .reverse()
  //     .filter(
  //       (registration) =>
  //         registration.happening.date &&
  //         new Date(registration.happening.date) >= new Date() &&
  //         registration.status !== "unregistered",
  //     );

  const futureTournaments = ["Buldreturnering", "Buldreturnering 2", "Buldreturnering 3"];

  return (
    <div className="max-w-2xl">
      <Heading level={2} className="mb-4">
        Dine turneringer
      </Heading>
      <div>
        <Heading level={3} className="mt-14 pb-6 font-semibold">
          Kommende turneringer
        </Heading>
        {futureTournaments.length > 0 ? (
          <EventCards tournaments={futureTournaments} />
        ) : (
          <p>Du er ikke påmeldt noen kommende turneringer.</p>
        )}
      </div>
    </div>
  );
}

function EventCards({ tournaments }: { tournaments: Array<string> }) {
  return (
    <>
      <div className="flex flex-col">
        {tournaments.map((tournament) => (
          <Link
            href={`/auth/profil/turneringer`}
            key={tournament}
            className="rounded-md p-4 hover:bg-muted"
          >
            <h1 className="my-auto line-clamp-1 overflow-hidden text-lg sm:text-2xl">
              {tournament}
            </h1>
          </Link>
        ))}
      </div>
    </>
  );
}
