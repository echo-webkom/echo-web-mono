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
import { getUser, getUserById } from "@/lib/get-user";
import { UploadProfilePicture } from "./_components/upload-profile-picture";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const userId = params.id;
  const profileOwner = await getUserById(userId);
  const currentUser = await getUser();

  if (!profileOwner) {
    return redirect("/hjem");
  }

  if (!currentUser) {
    return redirect("/auth/logg-inn");
  }

  const isProfileOwner = profileOwner.id === currentUser.id;
  const hasAccess = profileOwner.isPublic || isProfileOwner;

  const [degrees, memberships] = await Promise.all([
    getAllDegrees(),
    db.query.usersToGroups.findMany({
      where: (usersToGroup) => eq(usersToGroup.userId, profileOwner.id),
      with: {
        group: true,
      },
    }),
  ]);

  if (!hasAccess) {
    return (
      <div className="max-w-2xl space-y-4">
        <Heading level={2}>{`${profileOwner.name?.split(" ")[0]} sin profil`}</Heading>
        <Text>Denne brukeren har privat profil.</Text>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Heading level={2}>{`${profileOwner.name?.split(" ")[0]} sin profil`}</Heading>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6 md:flex-row">
          <UploadProfilePicture
            name={profileOwner.name ?? "Bo Bakseter"}
            image={profileOwner.image}
          />
          <div>
            <div>
              <Label>Navn</Label>
              <Text>{profileOwner.name}</Text>
            </div>
            <div>
              <Label>E-post</Label>
              <Text>{profileOwner.email}</Text>
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
      {isProfileOwner ? (
        <UserForm
          user={{
            id: profileOwner.id,
            degree: profileOwner.degree ?? undefined,
            year: profileOwner.year ?? undefined,
            alternativeEmail: profileOwner.alternativeEmail ?? undefined,
            hasReadTerms: profileOwner.hasReadTerms ?? undefined,
            isPublic: profileOwner.isPublic ?? undefined,
            birthday: profileOwner.birthday ?? undefined,
          }}
          degrees={degrees}
        />
      ) : (
        <div>
          <div>
            <Label>Degree</Label>
            <Text>{profileOwner.degree?.name}</Text>
          </div>
          <div>
            <Label>Year</Label>
            <Text>{profileOwner.year}</Text>
          </div>
          <div>
            <Label>Alternative Email</Label>
            <Text>{profileOwner.alternativeEmail}</Text>
          </div>
        </div>
      )}
    </div>
  );
}
