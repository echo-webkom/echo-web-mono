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
import { Chip } from "@/components/typography/chip";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { UserForm } from "@/components/user-form";
import { getUserRegistrations } from "@/lib/queries/user";

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
    <Container className="max-w-2xl gap-8">
      <Heading level={2}>Din profil</Heading>

      <div className="flex flex-col gap-2">
        <div>
          <Text size="sm" className="font-semibold">
            Navn
          </Text>
          <Text>{user.name}</Text>
        </div>
        <div>
          <Text size="sm" className="font-semibold">
            E-post:
          </Text>
          <Text>{user.email}</Text>
        </div>
        {memberships.length > 0 && (
          <div>
            <Text size="sm" className="mb-2 font-semibold">
              Grupper:
            </Text>

            <div className="flex flex-wrap gap-1">
              {memberships.map(({ group }) => (
                <Chip key={group.id} className="bg-secondary text-secondary-foreground">
                  {group.name}
                </Chip>
              ))}
            </div>
          </div>
        )}
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
        <Heading level={2} className="mb-4">
          Dine arrangementer
        </Heading>
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
    </Container>
  );
}
