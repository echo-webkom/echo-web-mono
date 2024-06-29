import Link from "next/link";

import { getProgrammerbarStatus } from "@/lib/get-programmerbar-status";
import { getUser } from "@/lib/get-user";
import { getRandomMessage } from "@/lib/random-message";
import {
  DesktopNavigation,
  DesktopNavigationRoot,
  DesktopNavigationViewport,
} from "./desktop-navigation";
import {
  MobileMenuButton,
  MobileNavigationRoot,
  MobileNavigationViewport,
} from "./mobile-navigation";
import { ModeToggle } from "./theme-switch-button";
import { Button } from "./ui/button";
import { HeaderLogo } from "./ui/header-logo";
import { UserMenu } from "./user-menu";

export const SiteHeader = async () => {
  const [user, { message }] = await Promise.all([getUser(), getProgrammerbarStatus()]);

  return (
    <div className="sticky top-0 z-50">
      <VercelPreviewNotify />

      <DesktopNavigationRoot>
        <MobileNavigationRoot>
          <div className="z-50 border-b bg-background">
            <header className="z-50 mx-auto flex max-w-7xl items-center justify-between bg-background px-4 py-2">
              <div className="absolute -bottom-3 z-[60] flex space-x-2">
                <div className="z-50 rounded-md bg-primary px-2 py-1 text-xs text-white">
                  <p>{getRandomMessage()}</p>
                </div>

                <div
                  className={`z-50 rounded-md bg-primary px-2 py-1 text-xs text-white ${message === "" ? "hidden" : "block"}`}
                >
                  <p>{message}</p>
                </div>
              </div>

              <div className="flex items-center">
                <HeaderLogo />
                <DesktopNavigation />
              </div>
              <div className="flex items-center space-x-2">
                <ModeToggle />

                {user ? (
                  <UserMenu user={user} />
                ) : (
                  <Button variant="secondary" asChild>
                    <Link href="/auth/logg-inn">Logg inn</Link>
                  </Button>
                )}

                <MobileMenuButton />
              </div>
            </header>

            <DesktopNavigationViewport />
            <MobileNavigationViewport />
          </div>
        </MobileNavigationRoot>
      </DesktopNavigationRoot>
    </div>
  );
};

const VercelPreviewNotify = () => {
  const isVercelPreview = process.env.VERCEL_ENV === "preview";

  if (isVercelPreview) {
    return (
      <div className="bg-red-400 p-2 text-center text-sm font-medium">
        <p>Dette er en forhåndsvisning av nettsiden. Databasen er ikke tilgjengelig.</p>
      </div>
    );
  }

  return null;
};
