import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";

import { Chip } from "@/components/typography/chip";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Label } from "@/components/ui/label";
import { UserForm } from "@/components/user-form";

export default async function ProfilePage() {
  const user = await auth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  const [degrees, memberships] = await Promise.all([
    db.query.degrees.findMany(),
    db.query.usersToGroups.findMany({
      where: (usersToGroup) => eq(usersToGroup.userId, user.id),
      with: {
        group: true,
      },
    }),
  ]);

  return (
    <div className="max-w-2xl space-y-4">
      <Heading level={2}>Din profil</Heading>

      <div className="flex flex-col gap-4">
        <div>
          <Label>Navn</Label>
          <Text>{user.name}</Text>
        </div>
        <div>
          <Label>E-post:</Label>
          <Text>{user.email}</Text>
        </div>

        {memberships.length > 0 && (
          <div>
            <Text size="sm" className="mb-2 font-semibold">
              Grupper:
            </Text>

            <ul className="flex flex-wrap gap-1">
              {memberships.map(({ group }) => (
                <li key={group.id}>
                  <Link href={`/gruppe/${group.id}`}>
                    <Chip
                      data-testid="group-chip"
                      key={group.id}
                      className="bg-secondary text-secondary-foreground hover:underline"
                    >
                      {group.name}
                    </Chip>
                  </Link>
                </li>
              ))}
            </ul>
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
    </div>
  );
}
