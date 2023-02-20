import {ReactNode} from "react";
import Footer from "./Footer";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

const Layout = ({children}: Props) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>{children}</main>
      <div className="flex flex-grow" />
      <Footer />
    </div>
  );
};

export default Layout;
