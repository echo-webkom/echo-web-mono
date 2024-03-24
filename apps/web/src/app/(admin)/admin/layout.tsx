import { type Metadata } from "next/types";

import { Footer } from "@/components/footer";
import { SidebarLayout } from "@/components/sidebar-layout";
import { SiteHeader } from "@/components/site-header";
import { ensureWebkom } from "@/lib/ensure";

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
  },
  {
    href: "/admin/tilbakemeldinger",
    label: "Tilbakemeldinger",
  },
  {
    href: "/admin/brukere",
    label: "Brukere",
  },
  {
    href: "/admin/happenings",
    label: "Happenings",
  },
  {
    href: "/admin/grupper",
    label: "Grupper",
  },
  {
    href: "/admin/studieretninger",
    label: "Studieretninger",
  },
  {
    href: "/admin/whitelist",
    label: "Whitelist",
  },
];

export default async function AdminDashboardLayout({ children }: Props) {
  await ensureWebkom();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex w-full flex-grow flex-row">
        <SidebarLayout routes={adminRoutes}>{children}</SidebarLayout>
      </div>
      <Footer />
    </div>
  );
}
