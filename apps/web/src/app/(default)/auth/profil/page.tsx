import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import {
  groupToString,
  happeningTypeToPath,
  happeningTypeToString,
  registrationStatusToString,
} from "@echo-webkom/lib";
import { db } from "@echo-webkom/storage";

import { Container } from "@/components/container";
import { UserForm } from "@/components/user-form";
import { getCurrentUser } from "@/lib/session";

export default async function ProfilePage() {
  const user = await getCurrentUser({
    with: {
      groups: true,
      registrations: true,
    },
  });

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  const registrations = await db.query.registrations.findMany({
    where: (r) => eq(r.userId, user.id),
    with: {
      happening: true,
    },
  });

  return (
    <Container className="max-w-2xl gap-10">
      <div className="flex flex-col gap-3">
        <h2 className="mb-3 text-2xl font-bold">Din profil</h2>
        <div>
          <p className="font-semibold">Navn:</p>
          <p>
            {user.firstName} {user.lastName}
          </p>
        </div>
        <div>
          <p className="font-semibold">E-post:</p>
          <p>{user.email}</p>
        </div>
        {user.groups.length > 0 && (
          <div>
            <p className="font-semibold">Grupper:</p>
            <p>{user.groups.map((group) => groupToString[group.id]).join(", ")}</p>
          </div>
        )}
      </div>

      <UserForm degree={user.degree} year={user.year} />

      <div>
        <h2 className="mb-3 text-2xl font-bold">Dine arrangementer</h2>
        {registrations.length > 0 ? (
          <ul className="flex flex-col divide-y">
            {registrations.map((registration) => (
              <li key={registration.happeningSlug}>
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
