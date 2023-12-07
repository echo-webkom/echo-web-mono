import { type ReactNode } from "react";

import { Banner } from "@/components/banner";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

type DefaultLayoutProps = {
  children: ReactNode;
};

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Banner />
      <SiteHeader />
      <div className="flex w-full flex-grow flex-col py-10">{children}</div>
      <Footer />
    </div>
  );
}
