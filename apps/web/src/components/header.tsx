import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Cross2Icon, HamburgerMenuIcon} from "@radix-ui/react-icons";
import {motion} from "framer-motion";

import {fetchBanner} from "@/api/banner";
import {type Banner} from "@/api/banner/schemas";
import {cn} from "@/utils/cn";
import WebsiteBanner from "./banner";
import HeaderLogo from "./header-logo";
import {DesktopNavigation, MobileNavigation} from "./navigation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const {pathname} = useRouter();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled((current) => {
        if (!current && (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)) {
          return true;
        }

        if (current && document.body.scrollTop < 5 && document.documentElement.scrollTop < 5) {
          return false;
        }
        return current;
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const setBannerMessage = async () => {
      const banner = await fetchBanner();
      setBanner(banner);
    };

    void setBannerMessage();
  }, []);

  return (
    <div className="sticky top-0 z-30 w-full bg-background">
      <WebsiteBanner banner={banner} />
      <motion.header
        style={{
          height: hasScrolled ? 60 : 100,
        }}
        className="mx-auto flex w-full max-w-7xl bg-inherit px-5 py-3 transition-all duration-150 ease-in-out"
      >
        <motion.div
          style={{
            height: hasScrolled ? 40 : 75,
            width: hasScrolled ? 40 : 75,
          }}
          className="h-20 w-20 transition-all duration-150 ease-in-out"
        >
          <HeaderLogo />
        </motion.div>
        <DesktopNavigation className="mt-auto hidden lg:block" />
        <button
          type="button"
          className={cn("ml-auto block lg:hidden", {
            "my-auto": hasScrolled,
            "mb-3 mt-auto": !hasScrolled,
          })}
          onClick={() => setIsOpen((current) => !current)}
        >
          {!isOpen && <HamburgerMenuIcon className="h-6 w-6" />}
          {isOpen && <Cross2Icon className="h-6 w-6" />}
        </button>
      </motion.header>
      <hr />
      {isOpen && (
        <div className="absolute z-10 mx-auto w-full px-1 py-3 sm:px-3">
          <MobileNavigation />
        </div>
      )}
    </div>
  );
};

export default Header;
