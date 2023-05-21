import {redirect} from "next/navigation";

import Footer from "@/components/footer";
import Header from "@/components/header";
import {getServerSession} from "@/lib/session";
import AdminSidebar from "./sidebar";

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: "Admin",
};

export default async function AdminDashboardLayout({children}: Props) {
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
      {/* @ts-expect-error Server Component */}
      <Footer />
    </div>
  );
}
