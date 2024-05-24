import { type ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";

type DefaultLayoutProps = {
  children: ReactNode;
};

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex w-full flex-grow flex-col">{children}</div>
      <Footer />
    </div>
  );
}
