import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";

import {getHappeningBySlug} from "@echo-webkom/db/queries/happening";
import {getUserById} from "@echo-webkom/db/queries/user";

import {isEventOrganizer} from "@/lib/happening";

type Props = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

export default async function EventDashboardLayout({children, params}: Props) {
  const session = await getServerSession();

  if (!session?.user.id) {
    return redirect("/api/auth/signin");
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    return redirect("/api/auth/signin");
  }

  const event = await getHappeningBySlug(params.slug);

  if (!event) {
    return redirect("/api/auth/signin");
  }

  const isAdmin = session.user.role === "ADMIN";

  if (!isAdmin && !isEventOrganizer(user, event)) {
    return redirect("/api/auth/signin");
  }

  return {children};
}
