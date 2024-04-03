import {
  Sidebar,
  SidebarItem,
  SidebarLayoutContent,
  SidebarLayoutRoot,
} from "@/components/sidebar-layout";

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
