import { redirect } from "next/navigation";

import { isEventOrganizer } from "@/lib/happening";
import { getHappeningBySlug } from "@/lib/queries/happening";
import { getUser } from "@/lib/session";

type Props = {
  children: React.ReactNode;
};

export default async function EventDashboardLayout({ children}: Props) {
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/signin");
  }

  return <>{children}</>;
}
