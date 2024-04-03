import { type Metadata } from "next/types";

import {
  Sidebar,
  SidebarItem,
  SidebarLayoutContent,
  SidebarLayoutRoot,
} from "@/components/sidebar-layout";
import { ensureBedkom } from "@/lib/ensure";

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: "Prikker",
} satisfies Metadata;

const routes = [
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
  await ensureBedkom();

  return (
    <SidebarLayoutRoot>
      <Sidebar>
        {routes.map((route) => {
          return (
            <SidebarItem key={route.href} href={route.href}>
              {route.label}
            </SidebarItem>
          );
        })}
      </Sidebar>
      <SidebarLayoutContent className="px-4 pt-5 sm:px-6 lg:px-8">{children}</SidebarLayoutContent>
    </SidebarLayoutRoot>
  );
}
