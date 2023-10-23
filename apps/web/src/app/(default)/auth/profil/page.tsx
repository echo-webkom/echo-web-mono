import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import {
  happeningTypeToPath,
  happeningTypeToString,
  registrationStatusToString,
} from "@echo-webkom/lib";

import { Container } from "@/components/container";
import { UserForm } from "@/components/user-form";
import { getUserRegistrations } from "@/lib/queries/user";
import { VerifyButton } from "./verify-button";

export default async function ProfilePage() {
  const user = await getAuth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  const [registrations, degrees, memberships] = await Promise.all([
    getUserRegistrations(user.id),
    db.query.degrees.findMany(),
    db.query.usersToGroups.findMany({
      where: (usersToGroup) => eq(usersToGroup.userId, user.id),
      with: {
        group: true,
      },
    }),
  ]);

  return (
    <Container className="max-w-2xl gap-10">
      <div className="flex flex-col gap-3">
        <h2 className="mb-3 text-2xl font-bold">Din profil</h2>
        <div>
          <p className="font-semibold">Navn:</p>
          <p>{user.name}</p>
        </div>
        <div>
          <p className="font-semibold">E-post:</p>
          <p>{user.email}</p>
        </div>
        {memberships.length > 0 && (
          <div>
            <p className="font-semibold">Grupper:</p>
            <p>{memberships.map((membership) => membership.group.name).join(", ")}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border p-2">
        <h2 className="text-lg font-semibold">Verifiser din UiB-bruker</h2>
        <VerifyButton verified={user.verifiedAt !== null}/>
      </div>

      <UserForm
        user={{
          id: user.id,
          degree: user.degree ?? undefined,
          year: user.year ?? undefined,
          alternativeEmail: user.alternativeEmail ?? undefined,
        }}
        degrees={degrees}
      />

      <div>
        <h2 className="mb-3 text-2xl font-bold">Dine arrangementer</h2>
        {registrations.length > 0 ? (
          <ul className="flex flex-col divide-y">
            {registrations.map((registration) => (
              <li key={registration.happening.slug}>
                <div className="py-3">
                  <Link
                    href={
                      happeningTypeToPath[registration.happening.type] +
                      "/" +
                      registration.happening.slug
                    }
                    className="text-lg font-semibold hover:underline"
                  >
                    {registration.happening.title}
                  </Link>

                  <div className="mt-3 flex items-center gap-3">
                    <Tag>
                      <p>{happeningTypeToString[registration.happening.type]}</p>
                    </Tag>
                    <Tag>
                      <p>{registrationStatusToString[registration.status]}</p>
                    </Tag>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Du er ikke påmeldt noen arrangementer.</p>
        )}
      </div>
    </Container>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <div className="rounded-full bg-wave px-3 py-1 text-sm font-semibold">{children}</div>;
}
