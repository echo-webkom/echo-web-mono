import {type ReactNode} from "react";

import {Footer} from "@/components/footer";
import {Header} from "@/components/header";

type DefaultLayoutProps = {
  children: ReactNode;
};

export default function DefaultLayout({children}: DefaultLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="my-10 flex w-full flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
