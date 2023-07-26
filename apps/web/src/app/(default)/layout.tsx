import {type ReactNode} from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import WebsiteBanner from "@/components/website-banner";

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({children}: DefaultLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore Server Component */}
      <WebsiteBanner />
      <Header />
      <main className="my-10 flex w-full flex-grow">{children}</main>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore Server Component */}
      <Footer />
    </div>
  );
}
