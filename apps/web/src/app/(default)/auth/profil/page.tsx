import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db/serverless";

import { Callout } from "@/components/typography/callout";
import { Chip } from "@/components/typography/chip";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Label } from "@/components/ui/label";
import { UserForm } from "@/components/user-form";
import { getAllDegrees } from "@/data/degrees/queries";
import { getUser } from "@/lib/get-user";
import { shortDateNoTime } from "@/utils/date";
import { UploadProfilePicture } from "./_components/upload-profile-picture";
import WhitelistNotification from "./_components/whitelist-notification";

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  const [strikes, degrees, memberships] = await Promise.all([
    db.query.dots.findMany({
      where: (row, { eq }) => eq(row.userId, user.id),
    }),
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
      {user.banInfo && (
        <Callout type="danger">
          <Text size="sm" className="font-medium">
            Du er utestengt fra bedriftpresentasjoner frem til{" "}
            {shortDateNoTime(user.banInfo.expiresAt)}, grunnet {`"${user.banInfo.reason}"`}.
          </Text>
        </Callout>
      )}

      {strikes.length > 0 && (
        <Callout type="warning">
          <Text size="sm" className="font-medium">
            Du har {strikes.length} prikk(er) registrert:
          </Text>

          <ul className="list-disc -space-y-2 pl-4">
            {strikes.map((strike) => (
              <li key={strike.id}>
                <Text size="sm">
                  {strike.count} prikk(er) frem til {shortDateNoTime(strike.expiresAt)}.
                </Text>
              </li>
            ))}
          </ul>
        </Callout>
      )}

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
      <WhitelistNotification />
      <UserForm
        user={{
          id: user.id,
          degree: user.degree ?? undefined,
          year: user.year ?? undefined,
          alternativeEmail: user.alternativeEmail ?? undefined,
          hasReadTerms: user.hasReadTerms ?? undefined,
          birthday: user.birthday ?? undefined,
        }}
        degrees={degrees}
      />
    </div>
  );
}
