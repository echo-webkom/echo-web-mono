import { redirect } from "next/navigation";

import { getAuth } from "@echo-webkom/auth";

import { getHappeningBySlug } from "@/lib/queries/happening";

type Props = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

export default async function EventDashboardLayout({ children, params }: Props) {
  const user = await getAuth();

  if (!user) {
    return redirect("/api/auth/signin");
  }

  if (user.type !== "admin") {
    return redirect("/api/auth/signin");
  }

  const event = await getHappeningBySlug(params.slug);

  if (!event) {
    return redirect("/api/auth/signin");
  }

  return <>{children}</>;
}
