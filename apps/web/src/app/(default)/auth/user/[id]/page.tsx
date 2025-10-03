import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeftIcon } from "lucide-react";

import { db } from "@echo-webkom/db/serverless";

import { auth, getProfileOwner } from "@/auth/session";
import { Chip } from "@/components/typography/chip";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserForm } from "@/components/user-form";
import { getAllDegrees } from "@/data/degrees/queries";
import { UploadProfilePicture } from "../../profil/_components/upload-profile-picture";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await auth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  const ownerId = String(params.id);
  const profileOwner = await getProfileOwner(ownerId);

  if (!profileOwner) {
    return redirect("/hjem");
  }

  const isProfileOwner = ownerId === user.id;
  const hasAccess = profileOwner?.isPublic ?? isProfileOwner;

  const [degrees, memberships] = await Promise.all([
    getAllDegrees(),
    db.query.usersToGroups.findMany({
      where: (usersToGroup) => eq(usersToGroup.userId, ownerId),
      with: {
        group: true,
      },
    }),
  ]);

  if (!isProfileOwner && hasAccess) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <Heading level={2}>{`${profileOwner.name?.split(" ")[0]} sin profil`}</Heading>
          </div>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Brukerinformasjon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-28 w-28">
                    {profileOwner.image ? (
                      <AvatarImage src={profileOwner.image} alt={profileOwner.name ?? ""} />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {profileOwner.name?.slice(0, 1) ?? "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Navn</Label>
                    <Text className="text-lg font-medium">{profileOwner.name}</Text>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">E-post</Label>
                    <Text>{profileOwner.email}</Text>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Studieretning</Label>
                    <Text>{profileOwner.degree?.name ?? "Ikke angitt"}</Text>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Årstrinn</Label>
                    <Text>{profileOwner.year ? `${profileOwner.year}. trinn` : "Ikke angitt"}</Text>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {memberships.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium">Medlemskap</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <ul className="flex flex-wrap gap-2">
                    {memberships.map(({ group }) => (
                      <li key={group.id}>
                        <Link href={`/gruppe/${group.id}`}>
                          <Chip variant="secondary" className="hover:underline">
                            {group.name}
                          </Chip>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  } else if (isProfileOwner) {
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
              alternativeEmail:
                "alternativeEmail" in profileOwner
                  ? (profileOwner.alternativeEmail ?? undefined)
                  : undefined,
              hasReadTerms: !!profileOwner.hasReadTerms,
              isPublic:
                "isPublic" in profileOwner ? (profileOwner.isPublic ?? undefined) : undefined,
              birthday:
                "birthday" in profileOwner ? (profileOwner.birthday ?? undefined) : undefined,
            }}
            degrees={degrees}
          />
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <Heading
            level={2}
            className="mb-4 text-center"
          >{`${profileOwner.name?.split(" ")[0]} sin profil`}</Heading>
          <Card className="border-muted shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <Text className="text-lg font-medium">Denne brukeren har privat profil.</Text>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-6 text-center">
            <Link href={`/auth/user/${user.id}`}>
              <Button variant="ghost">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Gå til egen profil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
