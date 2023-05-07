import {type ReactNode} from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import {getServerSession} from "@/lib/session";

type DefaultLayoutProps = {
  children: ReactNode;
};

export default async function DefaultLayout({children}: DefaultLayoutProps) {
  const session = await getServerSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Header session={session} />
      <main className="my-10 flex w-full flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
