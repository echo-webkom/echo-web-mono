import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Cross2Icon, HamburgerMenuIcon} from "@radix-ui/react-icons";
import {signIn, signOut, useSession} from "next-auth/react";

import {fetchBanner} from "@/api/settings";
import {type Banner} from "@/api/settings/schemas";
import WebsiteBanner from "./banner";
import HeaderLogo from "./header-logo";
import {DesktopNavigation, MobileNavigation} from "./navigation";
import {Button} from "./ui/button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);

  const {pathname} = useRouter();
  const {data: session} = useSession();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const setBannerMessage = async () => {
      const banner = await fetchBanner();
      setBanner(banner);
    };

    void setBannerMessage();
  }, []);

  return (
    <div className="z-30 w-full bg-background">
      <WebsiteBanner banner={banner} />

      <header className="flex w-full items-center justify-between bg-inherit px-5 py-3 lg:px-10">
        <div className="h-14 w-14">
          <HeaderLogo />
        </div>

        <button
          className="block lg:hidden"
          type="button"
          onClick={() => setIsOpen((current) => !current)}
        >
          {!isOpen && <HamburgerMenuIcon className="h-6 w-6" />}
          {isOpen && <Cross2Icon className="h-6 w-6" />}
        </button>

        <div className="hidden lg:block">
          <DesktopNavigation />
        </div>

        <div className="hidden lg:block">
          {session ? (
            <Button onClick={() => void signOut()} variant="outline">
              Logg ut
            </Button>
          ) : (
            <Button onClick={() => void signIn()} variant="outline">
              Logg inn
            </Button>
          )}
        </div>
      </header>

      {isOpen && (
        <div className="absolute z-10 mx-auto w-full px-1 py-3 sm:px-3">
          <MobileNavigation />
        </div>
      )}
    </div>
  );
};

export default Header;
