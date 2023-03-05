import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import {CaretDownIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import {NavItem, routes} from "@/lib/routes";
import {useSession} from "next-auth/react";
import classNames from "classnames";

interface DesktopNavigationProps {
  className?: string;
}

export const DesktopNavigation = ({className}: DesktopNavigationProps) => {
  const {data: userSession} = useSession();

  return (
    <NavigationMenu.Root
      className={classNames(
        "justify-right relative z-[1] ml-auto flex",
        className,
      )}
    >
      <NavigationMenu.List className="center m-0 flex list-none rounded-[6px]">
        {routes.map((route: NavItem) => {
          if (route.session === !userSession) {
            return null;
          }

          return "sublinks" in route ? (
            <NavigationMenu.Item key={route.label}>
              <NavigationMenu.Trigger className="group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none text-black outline-none hover:bg-black/5 focus:shadow-[0_0_0_2px]">
                {route.label}
                <CaretDownIcon
                  className="relative top-[1px] text-black transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                  aria-hidden
                />
              </NavigationMenu.Trigger>

              <NavigationMenu.Content className="absolute top-0 left-0 w-full shadow-black/10 data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight sm:w-auto">
                <ul className="one m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]">
                  {route.sublinks.map((sublink) => (
                    <li key={sublink.label}>
                      <NavigationMenu.Link
                        asChild
                        className="block select-none rounded-[6px] p-3 text-[15px] leading-none no-underline outline-none transition-colors hover:bg-black/5 focus:shadow-[0_0_0_2px]"
                      >
                        <Link href={sublink.href}>{sublink.label}</Link>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item key={route.label}>
              <NavigationMenu.Link
                className="block select-none rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none text-black no-underline outline-none hover:bg-black/5 focus:shadow-[0_0_0_2px]"
                href="https://github.com/radix-ui"
              >
                {route.label}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          );
        })}
        <NavigationMenu.Indicator className="top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease] data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut">
          <div className="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] bg-white" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className="absolute top-full left-0 flex w-full justify-center perspective-[2000px]">
        <NavigationMenu.Viewport className="relative mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-[6px] border bg-white shadow-sm transition-[width,_height] duration-300 data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut sm:w-[var(--radix-navigation-menu-viewport-width)]" />
      </div>
    </NavigationMenu.Root>
  );
};
