import { createProfilePictureUrl } from "@/api/client";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import type { User } from "../../../../../../api/uno/client";
import { ProfileMemberships } from "./profile-memberships";

type PublicProfileProps = {
  profileOwner: User;
};

export function PublicProfile({ profileOwner }: PublicProfileProps) {
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
                <Avatar size="xl">
                  {profileOwner.hasImage ? (
                    <AvatarImage
                      src={createProfilePictureUrl(profileOwner.id, 2)}
                      alt={profileOwner.name ?? ""}
                    />
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

        {profileOwner.groups.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Medlemskap</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileMemberships groups={profileOwner.groups} variant="card" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
