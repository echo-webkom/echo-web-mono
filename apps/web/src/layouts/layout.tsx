import {type ReactNode} from "react";

import Feedback from "@/components/feedback";
import Footer from "@/components/footer";
import Header from "@/components/header";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({children}: LayoutProps) => {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="my-10">{children}</main>
        <Feedback />
        <Footer className="mt-auto" />
      </div>
    </>
  );
};

export default Layout;
