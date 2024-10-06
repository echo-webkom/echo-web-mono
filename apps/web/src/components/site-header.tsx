import Link from "next/link";

import { getProgrammerbarStatus } from "@/lib/get-programmerbar-status";
import { getUser } from "@/lib/get-user";
import { getRandomMessage } from "@/lib/random-message";
import { DesktopNavigation, NavigationRoot, NavigationViewport } from "./desktop-navigation";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeSwitchButton } from "./theme-switch-button";
import { Chip } from "./typography/chip";
import { Button } from "./ui/button";
import { HeaderLogo } from "./ui/header-logo";
import { UserMenu } from "./user-menu";

export const SiteHeader = async () => {
  const user = await getUser();
  const message = (await getProgrammerbarStatus()).message;

  return (
    <div className="sticky top-0 z-20">
      <VercelPreviewNotify />

      <div className="border-b-2 bg-background">
        <NavigationRoot>
          <header className="mx-auto flex max-w-7xl items-center justify-between bg-background px-4 py-2">
            <div className="absolute -bottom-3 flex space-x-2">
              <Chip className="z-50">{getRandomMessage()}</Chip>
              {message !== "" && <Chip className="z-50">{message}</Chip>}
            </div>

            <div className="flex items-center">
              <HeaderLogo />
              <DesktopNavigation />
            </div>
            <div className="flex items-center space-x-2">
              <NotificationMenu />
              <ThemeSwitchButton />
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
