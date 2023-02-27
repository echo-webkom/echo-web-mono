import {ReactNode} from "react";
import {Header, Footer} from "@/components";

interface Props {
  children: ReactNode;
}

export const Layout = ({children}: Props) => {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-navy">
      <Header />
      <main>{children}</main>
      <div className="flex flex-grow" />
      <Footer />
    </div>
  );
};
