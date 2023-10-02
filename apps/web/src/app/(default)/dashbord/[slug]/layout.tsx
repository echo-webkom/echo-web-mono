import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db, getHappening } from "@echo-webkom/storage";

import { getJwtPayload } from "@/lib/session";

type Props = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

export default async function EventDashboardLayout({ children, params }: Props) {
  const jwt = await getJwtPayload();

  if (!jwt) {
    return redirect("/api/auth/signin");
  }

  const happening = await getHappening(params.slug);

  if (!happening) {
    return redirect("/api/auth/signin");
  }

  const user = await db.query.users.findFirst({
    where: (u) => eq(u.id, jwt.sub),
  });

  const isAdmin = user?.type === "admin";

  // TODO Check if user is organizer
  // if (!isAdmin && !isEventOrganizer(user, event)) {
  //   return redirect("/api/auth/signin");
  // }
  if (!isAdmin) {
    return redirect("/api/auth/signin");
  }

  return <>{children}</>;
}
