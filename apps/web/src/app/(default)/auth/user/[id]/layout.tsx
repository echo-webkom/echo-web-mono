import {
  Sidebar,
  SidebarItem,
  SidebarLayoutContent,
  SidebarLayoutRoot,
} from "@/components/sidebar-layout";
import { getUser } from "@/lib/get-user";

const getRoutes = (userId: string) => {
  return [
    {
      label: "Profil",
      href: `/auth/user/${userId}`,
    },
    {
      label: "Arrangementer",
      href: `/auth/user/${userId}/arrangementer`,
    },
    {
      label: "Prikker",
      href: `/auth/user/${userId}/prikker`,
    },
  ];
};

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const routes = getRoutes(user.id);

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
