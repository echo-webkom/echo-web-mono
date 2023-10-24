import Link from "next/link";

import { getAuth } from "@echo-webkom/auth";

import { getDatabaseStatus } from "@/utils/database-status";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileNavigation } from "./mobile-navigation";
import { ProfileIcon } from "./profile-icon";
import { Button } from "./ui/button";
import { HeaderLogo } from "./ui/header-logo";

export async function SiteHeader() {
  const user = await getAuth();

  return (
    <div className="sticky top-0 z-20">
      <DatabaseStatusBar />

      <div className="border-b bg-background">
        <header className="mx-auto flex max-w-7xl items-center justify-between bg-background px-4 py-2">
          <div className="flex items-center">
            <HeaderLogo />
            <DesktopNavigation />
          </div>
          <div className="flex items-center">
            {user ? (
              <ProfileIcon user={user} />
            ) : (
              <Button variant="secondary" asChild>
                <Link href="/auth/logg-inn">Logg inn</Link>
              </Button>
            )}
            <MobileNavigation />
          </div>
        </header>
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
