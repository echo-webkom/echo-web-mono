import { auth } from "@/auth/session";
import {
  Sidebar,
  SidebarItem,
  SidebarLayoutContent,
  SidebarLayoutRoot,
} from "@/components/sidebar-layout";

const getRoutes = (profileOwnerId: string) => {
  return [
    {
      label: "Profil",
      href: `/auth/user/${profileOwnerId}`,
    },
    {
      label: "Arrangementer",
      href: `/auth/user/${profileOwnerId}/arrangementer`,
    },
    // {
    //   label: "Prikker",
    //   href: `/auth/user/${profileOwnerId}/prikker`,
    // },
  ];
};

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const currentUser = await auth();

  if (!currentUser) {
    return null;
  }

  const profileOwnerId = params.id;
  const routes = getRoutes(profileOwnerId);

  if (currentUser.id !== profileOwnerId) {
    return (
      <SidebarLayoutContent className="px-4 pt-5 sm:px-6 lg:px-8">{children}</SidebarLayoutContent>
    );
  }

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
