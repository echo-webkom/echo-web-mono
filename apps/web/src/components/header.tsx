import {useEffect, useState} from "react";
import Link from "next/link";
import {Cross2Icon, HamburgerMenuIcon} from "@radix-ui/react-icons";
import {signIn, useSession} from "next-auth/react";

import {fetchBanner} from "@/api/settings";
import {type Banner} from "@/api/settings/schemas";
import {headerRoutes} from "@/lib/routes";
import WebsiteBanner from "./banner";
import HeaderLogo from "./header-logo";
import ProfileIcon from "./profile-icon";
import {Button} from "./ui/button";

const Header = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const {data: session} = useSession();

  useEffect(() => {
    const updateBanner = async () => {
      const newBanner = await fetchBanner();

      setBanner(newBanner);
    };

    void updateBanner();
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <WebsiteBanner banner={banner} />

      {/* HeaderRoot */}
      <header className="relative flex w-full flex-col bg-background">
        {/* HeaderOverlay */}
        {isOpen && (
          <div
            className="fixed left-0 top-0 z-[1] h-full w-full bg-black bg-opacity-20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Header */}
        <div className="z-30 flex items-center justify-between bg-background px-5 py-5 md:px-10">
          <div className="h-14 w-14">
            <HeaderLogo />
          </div>

          <div className="flex items-center gap-5">
            {session ? (
              <ProfileIcon session={session} />
            ) : (
              <Button onClick={() => void signIn()} variant="link">
                Logg inn
              </Button>
            )}

            <button type="button" onClick={handleToggle}>
              {!isOpen && <HamburgerMenuIcon className="h-6 w-6" />}
              {isOpen && <Cross2Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* HeaderMenu */}
        <div className="relative">
          {isOpen && (
            <div className="absolute z-20 w-full bg-background px-5 pb-20 pt-14">
              <div className="mx-auto max-w-5xl">
                <ul className="flex flex-col items-start gap-5 text-2xl font-bold md:flex-row md:items-center">
                  <HeaderMenuItem href="/event">Arrangementer</HeaderMenuItem>
                  <HeaderMenuItem href="/for-students/subgroup">Undergrupper</HeaderMenuItem>
                  <HeaderMenuItem href="/for-students/post">Innlegg</HeaderMenuItem>
                  {session && <HeaderMenuItem href="/auth/profile">Min profil</HeaderMenuItem>}
                </ul>
              </div>

              <hr className="my-10" />

              <div className="flex flex-col gap-10">
                {headerRoutes.map((route) => (
                  <div key={route.label} className="mx-auto w-full max-w-5xl">
                    <h3 className="mb-3 text-2xl font-bold">{route.label}</h3>
                    <ul className="flex flex-wrap items-center gap-8 text-lg font-medium">
                      {route.sublinks.map((subRoute) => (
                        <HeaderMenuItem key={subRoute.label} href={subRoute.href}>
                          {subRoute.label}
                        </HeaderMenuItem>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <hr />
      </header>
    </>
  );
};

const HeaderMenuItem = ({children, href}: {children: React.ReactNode; href: string}) => {
  return (
    <li>
      <Link className="hover:underline" href={href}>
        {children}
      </Link>
    </li>
  );
};

export default Header;
