import {type ReactNode} from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import WebsiteBanner from "@/components/website-banner";

type DefaultLayoutProps = {
  children: ReactNode;
};

export default function DefaultLayout({children}: DefaultLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* @ts-expect-error Server Component */}
      <WebsiteBanner />
      <Header />
      <main className="my-10 flex w-full flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
