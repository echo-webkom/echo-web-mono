import Link from "next/link";

import { auth } from "@echo-webkom/auth";

import { getDatabaseStatus } from "@/utils/database-status";
import { DesktopNavigation, NavigationRoot, NavigationViewport } from "./desktop-navigation";
import { MobileNavigation } from "./mobile-navigation";
import ModeToggle from "./theme-switch-button";
import { Button } from "./ui/button";
import { HeaderLogo } from "./ui/header-logo";
import { UserMenu } from "./user-menu";

export async function SiteHeader() {
  const user = await auth();

  return (
    <div className="sticky top-0 z-20">
      <DatabaseStatusBar />

      <div className="border-b bg-background">
        <NavigationRoot>
          <header className="mx-auto flex max-w-7xl items-center justify-between bg-background px-4 py-2">
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

async function DatabaseStatusBar() {
  const status = await getDatabaseStatus();

  if (!status) {
    return (
      <div className="bg-red-400 p-2 text-center text-sm font-medium">
        <p>
          Webkom har mistet kontakt med databasen. Dette er ikke bra. Vi jobber med å fikse det.
        </p>
      </div>
    );
  }

  return null;
}
