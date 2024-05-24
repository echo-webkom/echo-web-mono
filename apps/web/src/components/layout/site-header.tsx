import Link from "next/link";

import { getUser } from "@/lib/get-user";
import { getRandomMessage } from "@/lib/random-message";
import { MobileNavigation } from "../mobile-navigation";
import {
  DesktopNavigation,
  NavigationRoot,
  NavigationViewport,
} from "../reactions/desktop-navigation";
import { ModeToggle } from "../theme-switch-button";
import { Button } from "../ui/button";
import { HeaderLogo } from "../ui/header-logo";
import { UserMenu } from "../user-menu";

export async function SiteHeader() {
  const user = await getUser();
  return (
    <div className="sticky top-0 z-20">
      <VercelPreviewNotify />

      <div className="border-b bg-background">
        <NavigationRoot>
          <header className="mx-auto flex max-w-7xl items-center justify-between bg-background px-4 py-2">
            <div className="left-30 absolute -bottom-3 z-50 rounded-md bg-primary px-2 py-1 text-xs text-white">
              <p>{getRandomMessage()}</p>
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
              <MobileNavigation />
            </div>
          </header>

          <NavigationViewport />
        </NavigationRoot>
      </div>
    </div>
  );
}

function VercelPreviewNotify() {
  const isVercelPreview = process.env.VERCEL_ENV === "preview";

  if (isVercelPreview) {
    return (
      <div className="bg-red-400 p-2 text-center text-sm font-medium">
        <p>Dette er en forhåndsvisning av nettsiden. Databasen er ikke tilgjengelig.</p>
      </div>
    );
  }

  return null;
}
