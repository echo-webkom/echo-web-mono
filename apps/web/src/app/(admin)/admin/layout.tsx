import {redirect} from "next/navigation";
import {type Metadata} from "next/types";

import {Footer} from "@/components/footer";
import {Header} from "@/components/header";
import {getUser} from "@/lib/session";
import {AdminSidebar} from "./sidebar";

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: "Admin",
} satisfies Metadata;

export default async function AdminDashboardLayout({children}: Props) {
  const user = await getUser();

  if (!user) {
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
