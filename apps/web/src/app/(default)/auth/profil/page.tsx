import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db/serverless";

import { Chip } from "@/components/typography/chip";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Label } from "@/components/ui/label";
import { UserForm } from "@/components/user-form";
import { getAllDegrees } from "@/data/degrees/queries";
import { getUser } from "@/lib/get-user";
import { UploadProfilePicture } from "./_components/upload-profile-picture";

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  const [degrees, memberships] = await Promise.all([
    getAllDegrees(),
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
        <div className="flex flex-col gap-6 md:flex-row">
          <UploadProfilePicture name={user.name ?? "Bo Bakseter"} image={user.image} />

          <div>
            <div>
              <Label>Navn</Label>
              <Text>{user.name}</Text>
            </div>
            <div>
              <Label>E-post</Label>
              <Text>{user.email}</Text>
            </div>
          </div>
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
                    <Chip key={group.id} variant="secondary" className="hover:underline">
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
          hasReadTerms: user.hasReadTerms ?? undefined,
        }}
        degrees={degrees}
      />
    </div>
  );
}
