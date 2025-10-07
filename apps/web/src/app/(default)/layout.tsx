import { Fragment, type ReactNode } from "react";

import { AnimatedIcons, AnimatedSnowfall } from "@/components/animations/animated-icons";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

export type DefaultLayoutProps = {
  children: ReactNode;
};

const ThemeWrapper = ({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: "christmas" | "halloween" | "default";
}) => {
  const InnerWrapper =
    theme === "halloween" ? AnimatedIcons : theme === "christmas" ? AnimatedSnowfall : Fragment;
  const n = theme === "halloween" ? 40 : theme === "christmas" ? 40 : undefined;
  if (!n) {
    return <>{children}</>;
  }

  return <InnerWrapper n={n}>{children}</InnerWrapper>;
};

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const date = new Date();
  const month = date.getMonth();
  const isOctober = month === 9;
  const isChristmas = (month === 10 && date.getDate() >= 16) || month === 11;
  const theme = isOctober ? "halloween" : isChristmas ? "christmas" : "default";

  return (
    <ThemeWrapper theme={theme}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex w-full flex-grow flex-col">{children}</div>
        <Footer />
      </div>
    </ThemeWrapper>
  );
}
