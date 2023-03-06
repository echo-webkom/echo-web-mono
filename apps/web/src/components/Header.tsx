import {useState, useEffect} from "react";
import {useRouter} from "next/router";

import {DesktopNavigation} from "./Navigation";
import {HeaderLogo} from "./HeaderLogo";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {pathname} = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className={`${isOpen ? "min-h-screen" : ""}`}>
      <header className="container mx-auto flex py-3 px-3">
        <HeaderLogo />
        <DesktopNavigation className="mt-auto" />
      </header>
    </div>
  );
};
