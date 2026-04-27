import Link from "next/link";

import { auth } from "@/auth/session";
import { getRandomMessage } from "@/lib/random-message";

import { ENVIRONMENT } from "../config";
import { ActionChip } from "./action-chip";
import { DesktopNavigation, NavigationRoot, NavigationViewport } from "./desktop-navigation";
import {
  MobileNavigation,
  MobileNavigationRoot,
  MobileNavigationViewport,
} from "./mobile-navigation";
import { ThemeSwitchButton } from "./theme-switch-button";
import { Chip } from "./typography/chip";
import { Button } from "./ui/button";
import { HeaderLogo } from "./ui/header-logo";
import { UserMenu } from "./user-menu";

const getProgrammerbarStatus = async () => {
  try {
    return (await fetch("https://programmer.bar/api/status").then((res) => res.json())) as {
      message: string;
    };
  } catch {
    return {
      message: "",
    };
  }
};

export const SiteHeader = async () => {
  const user = await auth();
  const { message: progbarStatus } = await getProgrammerbarStatus();
  const randomMessage = getRandomMessage();

  return (
    <div className="sticky top-0 z-20">
      <ConstitutionDay />
      <PrideMonthBanner />
      <EnvironmentWarning />

      <div className="bg-card border-b">
        <MobileNavigationRoot>
          <NavigationRoot>
            <header className="bg-card mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
              <div className="absolute -bottom-3 flex space-x-2">
                {randomMessage.action ? (
                  <ActionChip action={randomMessage.action}>{randomMessage.text}</ActionChip>
                ) : randomMessage.link ? (
                  <Link className="z-50" href={randomMessage.link}>
                    <Chip className="underline">{randomMessage.text}</Chip>
                  </Link>
                ) : (
                  <Chip className="z-50">{randomMessage.text}</Chip>
                )}
                {progbarStatus !== "" && <Chip className="z-50">{progbarStatus}</Chip>}
              </div>

              <div className="flex items-center">
                <HeaderLogo />
                <DesktopNavigation />
              </div>
              <div className="flex items-center space-x-2">
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

          <MobileNavigationViewport />
        </MobileNavigationRoot>
      </div>
    </div>
  );
};

const EnvironmentWarning = () => {
  const isStaging = ENVIRONMENT === "staging";
  const isDevelopment = ENVIRONMENT === "development";

  if (isDevelopment) {
    return (
      <div className="bg-red-400 p-2 text-center text-sm font-medium">
        <p>Du kjører i utviklingsmiljø.</p>
      </div>
    );
  }

  if (isStaging) {
    return (
      <div className="bg-yellow-400 p-2 text-center text-sm font-medium text-black">
        <p>Du kjører i stagingmiljø.</p>
      </div>
    );
  }

  return null;
};

const NORWAY_COLORS = [
  "#e40303", // Red
  "#ffffff", // White
  "#004dff", // Blue
  "#ffffff", // White
  "#e40303", // Red
];

function ConstitutionDay() {
  const date = new Date();
  const isConstitutionDay = date.getDate() === 17 && date.getMonth() === 4; // May 17th

  if (!isConstitutionDay) {
    return null;
  }

  return (
    <div className="flex h-4 w-[110%] overflow-hidden">
      {NORWAY_COLORS.map((color) => (
        <div
          key={color}
          className="h-full flex-1"
          style={{ backgroundColor: color, transform: "skewX(-15deg)" }}
        />
      ))}
    </div>
  );
}

const PRIDE_COLORS = [
  "#e40303", // Red
  "#ff8c00", // Orange
  "#ffed00", // Yellow
  "#008026", // Green
  "#004dff", // Blue
  "#750787", // Purple
];

function PrideMonthBanner() {
  const isPrideMonth = new Date().getMonth() === 5; // June

  if (!isPrideMonth) {
    return null;
  }

  return (
    <div className="flex h-2 overflow-hidden">
      {PRIDE_COLORS.map((color) => (
        <div
          key={color}
          className="h-full flex-1"
          style={{ backgroundColor: color, transform: "skewX(-15deg)" }}
        />
      ))}
    </div>
  );
}
