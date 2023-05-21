import {redirect} from "next/navigation";

import {getHappeningBySlug} from "@echo-webkom/db/queries/happening";

import {isEventOrganizer} from "@/lib/happening";
import {getUser} from "@/lib/session";

type Props = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

export default async function EventDashboardLayout({children, params}: Props) {
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/signin");
  }

  const event = await getHappeningBySlug(params.slug);

  if (!event) {
    return redirect("/api/auth/signin");
  }

  const isAdmin = user.role === "ADMIN";

  if (!isAdmin && !isEventOrganizer(user, event)) {
    return redirect("/api/auth/signin");
  }

  return {children};
}
