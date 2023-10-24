import { redirect } from "next/navigation";
import { type Metadata } from "next/types";

import { getAuthSession } from "@echo-webkom/auth";

import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { AdminSidebar } from "./sidebar";

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: "Admin",
} satisfies Metadata;

export default async function AdminDashboardLayout({ children }: Props) {
  const session = await getAuthSession();

  if (!session) {
    return redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex w-full flex-grow flex-row">
        <AdminSidebar>{children}</AdminSidebar>
      </div>
      <Footer />
    </div>
  );
}
