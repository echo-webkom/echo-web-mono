import {type ReactNode} from "react";

import Feedback from "@/components/feedback";
import Footer from "@/components/footer";
import Header from "@/components/header";

type DefaultLayoutProps = {
  children: ReactNode;
};

const DefaultLayout = ({children}: DefaultLayoutProps) => {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="my-10">{children}</main>
        <Feedback />
        <Footer className="mt-auto" />
      </div>
    </>
  );
};

export default DefaultLayout;
