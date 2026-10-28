import { redirect } from "next/navigation";

import { uno } from "@/api/client";
import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";

import { OwnProfile } from "./_components/own-profile";
import { PrivateProfile } from "./_components/private-profile";
import { PublicProfile } from "./_components/public-profile";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProfilePage({ params }: Props) {
  const user = await auth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  const { id: ownerId } = await params;
  const profileOwner = await unoWithAdmin.users.byId(ownerId);

  if (!profileOwner) {
    return redirect("/hjem");
  }

  const isProfileOwner = ownerId === user.id;
  const hasAccess = profileOwner?.isPublic ?? isProfileOwner;

  const degrees = await uno.degrees.all();
  if (!isProfileOwner && hasAccess) {
    return <PublicProfile profileOwner={profileOwner} />;
  } else if (isProfileOwner) {
    return <OwnProfile user={profileOwner} degrees={degrees} />;
  } else {
    return <PrivateProfile profileOwner={profileOwner} />;
  }
}
