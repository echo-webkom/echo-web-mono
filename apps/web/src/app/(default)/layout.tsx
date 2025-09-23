import { type ReactNode } from "react";

import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

export type DefaultLayoutProps = {
  children: ReactNode;
};

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex w-full grow flex-col">{children}</div>
      <Footer />
    </div>
  );
}
