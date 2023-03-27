import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Cross2Icon, HamburgerMenuIcon} from "@radix-ui/react-icons";

import HeaderLogo from "./header-logo";
import {DesktopNavigation, MobileNavigation} from "./navigation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {pathname} = useRouter();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const [isShrunk, setShrunk] = useState(false);
  useEffect(() => {
    const handleShrink = () => {
      setShrunk((isShrunk) => {
        if (
          !isShrunk &&
          (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)
        ) {
          return true;
        }

        if (isShrunk && document.body.scrollTop < 5 && document.documentElement.scrollTop < 5) {
          return false;
        }

        return isShrunk;
      });
    };
    window.addEventListener("scroll", handleShrink);
    return () => window.removeEventListener("scroll", handleShrink);
  }, []);

  return (
    <div className="relative mb-20">
      <header
        style={{height: isShrunk ? 50 : 100}}
        className="fixed top-0 z-40 mx-auto flex w-full max-w-7xl bg-white py-3 px-5 transition-all duration-300 ease-in-out"
      >
        <HeaderLogo isShrunk={isShrunk} />
        {/* <Link href="/" className="flex items-center gap-5">
          <div
            style={headerAnimations}
            className="relative h-20 w-20 origin-right transition-all duration-300 ease-in-out md:h-24 md:w-24"
          >
            <Image src={logo} alt="logo" fill />
          </div>
        </Link> */}
        <DesktopNavigation className="mt-auto hidden lg:block" />
        <button
          type="button"
          className="mt-auto mb-5 ml-auto block lg:hidden"
          onClick={() => setIsOpen((b) => !b)}
        >
          {!isOpen && <HamburgerMenuIcon className="h-6 w-6" />}
          {isOpen && <Cross2Icon className="h-6 w-6" />}
        </button>
      </header>
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
