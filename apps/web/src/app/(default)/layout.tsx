import { type ReactNode } from "react";

import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { AnimatedIcons } from "@/components/animations/animated-icons";

export type DefaultLayoutProps = {
  children: ReactNode;
};

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const isOctober = new Date().getMonth() === 9;

  return (
    <AnimatedIcons n={40}>
      <div
        className="flex min-h-screen flex-col"
        data-theme={isOctober ? "halloween" : "default"}
      >
        <SiteHeader />
        <div className="flex w-full flex-grow flex-col">{children}</div>
        <Footer />
      </div>
    </AnimatedIcons>
  );
}
