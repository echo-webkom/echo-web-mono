import {
  Sidebar,
  SidebarItem,
  SidebarLayoutContent,
  SidebarLayoutRoot,
} from "@/components/sidebar-layout";
import { getUser } from "@/lib/get-user";

const routes = [
  {
    label: "Profil",
    href: "/auth/user/[id]/profil",
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

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return (
    <SidebarLayoutRoot>
      <Sidebar>
        {routes.map((route) => {
          return (
            <SidebarItem key={route.href} href={route.href.replace("[id", user.id)}>
              {route.label}
            </SidebarItem>
          );
        })}
      </Sidebar>
      <SidebarLayoutContent className="px-4 pt-5 sm:px-6 lg:px-8">{children}</SidebarLayoutContent>
    </SidebarLayoutRoot>
  );
}
