import {headerRoutes} from "@/lib/routes";
import {getSession} from "@/lib/session";
import {ProfileIcon} from "./profile-icon";
import {
  ExpandedMenu,
  ExpandedMenuItem,
  ExpandedMenuList,
  ExpandedMenuSection,
  ExpandedMenuTitle,
  Header,
  HeaderOverlay,
  HeaderProvider,
  NavigationMenu,
  NavigationMenuItem,
  TopMenu,
} from "./ui/header";
import {HeaderLogo} from "./ui/header-logo";

export const SiteHeader = async () => {
  const session = await getSession();

  return (
    <HeaderProvider>
      <HeaderOverlay />
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
          {headerRoutes.map((section) => {
            return (
              <ExpandedMenuSection key={section.label}>
                <ExpandedMenuTitle>{section.label}</ExpandedMenuTitle>
                <ExpandedMenuList>
                  {section.sublinks.map((item) => {
                    return (
                      <ExpandedMenuItem key={item.label} to={item.href}>
                        {item.label}
                      </ExpandedMenuItem>
                    );
                  })}
                </ExpandedMenuList>
              </ExpandedMenuSection>
            );
          })}
        </ExpandedMenu>
      </Header>
    </HeaderProvider>
  );
};
