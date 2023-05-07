import {type ReactNode} from "react";
import {notFound} from "next/navigation";

import Footer from "@/components/footer";
import Header from "@/components/header";
import AdminSidebar from "@/components/sidebar";
import {getServerSession} from "@/lib/session";

type DefaultLayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: "Admin",
};

export default async function DefaultLayout({children}: DefaultLayoutProps) {
  const session = await getServerSession();

  if (!session) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex w-full flex-grow flex-row">
        <AdminSidebar>{children}</AdminSidebar>
      </div>
      <Footer />
    </div>
  );
}
