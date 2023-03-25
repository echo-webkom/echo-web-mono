import {useEffect, useState, type ReactNode} from "react";
import {fetchBanner} from "@/api/banner";
import {type Banner} from "@/api/banner/schemas";

import WebsiteBanner from "./banner";
import Footer from "./footer";
import Header from "./header";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({children}: LayoutProps) => {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    const setBannerMessage = async () => {
      const banner = await fetchBanner();
      setBanner(banner);
    };

    void setBannerMessage();
  }, []);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        <WebsiteBanner banner={banner} />
        <Header />
        <main className="my-10">{children}</main>
        <Footer className="mt-auto" />
      </div>
    </>
  );
};

export default Layout;
