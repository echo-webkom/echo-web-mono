import {
  Sidebar,
  SidebarItem,
  SidebarLayoutContent,
  SidebarLayoutRoot,
} from "@/components/sidebar-layout";
import { getUser } from "@/lib/get-user";

<<<<<<< HEAD
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
    {
      label: "Prikker",
      href: `/auth/user/${profileOwnerId}/prikker`,
=======
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
>>>>>>> 7ceaf6c4 (fikset å se bruker profil via id)
    },
  ];
};

<<<<<<< HEAD
export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const currentUser = await getUser();
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
=======
export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const routes = getRoutes(user.id);
>>>>>>> 7ceaf6c4 (fikset å se bruker profil via id)

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
