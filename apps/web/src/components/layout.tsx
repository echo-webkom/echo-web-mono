import {type ReactNode} from "react";

import Footer from "./footer";
import Header from "./header";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({children}: LayoutProps) => {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="my-10">{children}</main>
        <Footer className="mt-auto" />
      </div>
    </>
  );
};

export default Layout;
