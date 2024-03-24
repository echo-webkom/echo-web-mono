import { redirect } from "next/navigation";
import { type Metadata } from "next/types";

import { auth } from "@echo-webkom/auth";

import { SidebarLayout } from "@/components/sidebar-layout";
import { isMemberOf } from "@/lib/memberships";

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: "Prikker",
} satisfies Metadata;

const strikesRoutes = [
  {
    href: "/prikker",
    label: "Oversikt",
  },
  {
    href: "/prikker/dashboard",
    label: "Dashboard",
  },
];

export default async function StrikesDashboardLayout({ children }: Props) {
  const user = await auth();

  if (!user || !isMemberOf(user, ["bedkom", "webkom"])) {
    return redirect("/");
  }

  return <SidebarLayout routes={strikesRoutes}>{children}</SidebarLayout>;
}
