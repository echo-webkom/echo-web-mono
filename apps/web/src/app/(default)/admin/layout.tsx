import { type Metadata } from "next/types";

import {
  Sidebar,
  SidebarItem,
  SidebarLayoutContent,
  SidebarLayoutRoot,
} from "@/components/layout/sidebar-layout";
import { ensureWebkomOrHovedstyret } from "@/lib/ensure";
import { isMemberOf } from "@/lib/memberships";

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: "Admin",
} satisfies Metadata;

const adminRoutes = [
  {
    href: "/admin",
    label: "Dashboard",
    groups: ["webkom", "hovedstyret"],
  },
  {
    href: "/admin/tilbakemeldinger",
    label: "Tilbakemeldinger",
    groups: ["webkom"],
  },
  {
    href: "/admin/brukere",
    label: "Brukere",
    groups: ["webkom"],
  },
  {
    href: "/admin/happenings",
    label: "Happenings",
    groups: ["webkom"],
  },
  {
    href: "/admin/grupper",
    label: "Grupper",
    groups: ["webkom", "hovedstyret"],
  },
  {
    href: "/admin/studieretninger",
    label: "Studieretninger",
    groups: ["webkom", "hovedstyret"],
  },
  {
    href: "/admin/whitelist",
    label: "Whitelist",
    groups: ["webkom", "hovedstyret"],
  },
];

export default async function AdminDashboardLayout({ children }: Props) {
  const user = await ensureWebkomOrHovedstyret();

  return (
    <SidebarLayoutRoot>
      <Sidebar>
        {adminRoutes.map((route) => {
          if (!isMemberOf(user, route.groups)) {
            return null;
          }

          return (
            <SidebarItem key={route.href} href={route.href}>
              {route.label}
            </SidebarItem>
          );
        })}
      </Sidebar>
      <SidebarLayoutContent className="pt-5">{children}</SidebarLayoutContent>
    </SidebarLayoutRoot>
  );
}
