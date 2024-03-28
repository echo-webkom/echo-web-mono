import { SidebarLayout } from "@/components/sidebar-layout";

const routes = [
  {
    label: "Profil",
    href: "/auth/profil",
  },
  {
    label: "Arrangementer",
    href: "/auth/profil/arrangementer",
  },
  {
    label: "Prikker",
    href: "/auth/profil/prikker",
  },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout routes={routes}>{children}</SidebarLayout>;
}
