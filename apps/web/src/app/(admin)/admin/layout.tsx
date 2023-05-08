import {type ReactNode} from "react";
import {redirect} from "next/navigation";

import Footer from "@/components/footer";
import Header from "@/components/header";
import {getServerSession} from "@/lib/session";
import AdminSidebar from "./sidebar";

type DefaultLayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: "Admin",
};

export default async function DefaultLayout({children}: DefaultLayoutProps) {
  const session = await getServerSession();

  if (!session) {
    return redirect("/api/auth/signin");
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
