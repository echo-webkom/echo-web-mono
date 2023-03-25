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

  return (
    <div className="relative">
      <header className="container mx-auto flex py-3 px-5">
        <HeaderLogo />
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
