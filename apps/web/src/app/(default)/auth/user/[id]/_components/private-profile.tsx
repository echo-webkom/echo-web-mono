import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Card, CardContent } from "@/components/ui/card";

import type { User } from "../../../../../../api/uno/client";

type PrivateProfileProps = {
  profileOwner: User;
};

export function PrivateProfile({ profileOwner }: PrivateProfileProps) {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <Heading level={2} className="mb-4 text-center">
          {`${profileOwner.name?.split(" ")[0]} sin profil`}
        </Heading>
        <Card className="border-muted shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <Text className="text-lg font-medium">Denne brukeren har privat profil.</Text>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 text-center"></div>
      </div>
    </div>
  );
}
