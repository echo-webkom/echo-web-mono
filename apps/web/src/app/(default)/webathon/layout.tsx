import { type Metadata } from "next";

import {
  Sidebar,
  SidebarItem,
  SidebarLayoutContent,
  SidebarLayoutRoot,
} from "@/components/sidebar-layout";

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Webathon",
};

const competitions = [
  {
    href: "/webathon/2025",
    label: "Webathon 2025",
  },
];

export default function WebathonLayout({ children }: Props) {
  return (
    <SidebarLayoutRoot>
      <Sidebar>
        <h1 className="mt-8 mb-4 border border-x-0 border-t-0 border-b-white p-2 text-xl font-bold">
          Resultater over årene
        </h1>
        {competitions.map((competition) => (
          <SidebarItem key={competition.href} href={competition.href}>
            {competition.label}
          </SidebarItem>
        ))}
      </Sidebar>
      <SidebarLayoutContent className="px-4 pt-5 sm:px-6 lg:px-8">{children}</SidebarLayoutContent>
    </SidebarLayoutRoot>
  );
}
