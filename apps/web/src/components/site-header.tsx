import { headerRoutes } from "@/lib/routes";
import { getSession } from "@/lib/session";
import { getDatabaseStatus } from "@/utils/database-status";
import { ProfileIcon } from "./profile-icon";
import {
  ExpandedMenu,
  ExpandedMenuItem,
  ExpandedMenuList,
  ExpandedMenuSection,
  ExpandedMenuTitle,
  Header,
  HeaderProvider,
  NavigationMenu,
  NavigationMenuItem,
  TopMenu,
} from "./ui/header";
import { HeaderLogo } from "./ui/header-logo";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <HeaderProvider>
      <DatabaseStatusBar />
      <Header>
        <TopMenu>
          <HeaderLogo />
          <NavigationMenu>
            {session ? (
              <ProfileIcon session={session} />
            ) : (
              <NavigationMenuItem to="/auth/sign-in">Logg inn</NavigationMenuItem>
            )}
          </NavigationMenu>
        </TopMenu>

        <ExpandedMenu>
          {headerRoutes.map((section) => (
            <ExpandedMenuSection key={section.label}>
              <ExpandedMenuTitle>{section.label}</ExpandedMenuTitle>
              <ExpandedMenuList>
                {section.sublinks.map((item) => (
                  <ExpandedMenuItem key={item.label} to={item.href}>
                    {item.label}
                  </ExpandedMenuItem>
                ))}
              </ExpandedMenuList>
            </ExpandedMenuSection>
          ))}
        </ExpandedMenu>
      </Header>
    </HeaderProvider>
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
