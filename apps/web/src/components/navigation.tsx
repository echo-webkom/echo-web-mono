import Link from "next/link";
import {headerRoutes} from "@/lib/routes";
import * as Accordion from "@radix-ui/react-accordion";
import {CaretDownIcon, ChevronDownIcon} from "@radix-ui/react-icons";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import cn from "classnames";
import {useSession} from "next-auth/react";

type DesktopNavigationProps = {
  className?: string;
};

export const DesktopNavigation = ({className}: DesktopNavigationProps) => {
  const {data: userSession} = useSession();

  return (
    <NavigationMenu.Root className={cn("justify-right relative z-10 ml-auto flex", className)}>
      {/* Navigation routes */}
      <NavigationMenu.List className="center m-0 flex list-none gap-1 rounded-md">
        {headerRoutes.map((route) => {
          if (route.session === !userSession) {
            return null;
          }

          return "sublinks" in route ? (
            <NavigationMenu.Item key={route.label}>
              <NavigationMenu.Trigger className="text-md group flex select-none items-center justify-between gap-1 rounded-md px-3 py-2 font-medium leading-none outline-none hover:bg-black/5 focus:shadow-[0_0_0_2px] focus:shadow-echo-blue2">
                {route.label}
                <CaretDownIcon
                  className="relative top-[1px] transition-transform duration-150 ease-in group-data-[state=open]:-rotate-180"
                  aria-hidden
                />
              </NavigationMenu.Trigger>

              <NavigationMenu.Content className="absolute top-0 left-0 w-full shadow-black/10 data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight sm:w-auto">
                <ul className="one m-0 grid list-none gap-x-[10px] p-6 sm:w-[500px] sm:grid-cols-[0.75fr_1fr]">
                  {route.sublinks.map((sublink) => (
                    <li key={sublink.label}>
                      <NavigationMenu.Link
                        asChild
                        className="text-md group flex select-none items-center justify-between gap-1 rounded-md px-3 py-3 font-medium leading-none outline-none hover:bg-black/5 focus:shadow-[0_0_0_2px] focus:shadow-echo-blue2"
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
                className="text-md group flex select-none items-center justify-between gap-1 rounded-md px-3 py-2 font-medium leading-none outline-none hover:bg-black/5 focus:shadow-[0_0_0_2px] focus:shadow-echo-blue2"
                href={route.href}
              >
                {route.label}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          );
        })}

        {/* Popover indicator (arrow). Shows below `NavigationMenu.Trigger` */}
        <NavigationMenu.Indicator className="top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease] data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut">
          <div className="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] border bg-white" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      {/* Popover content */}
      <div className="absolute top-full left-0 flex w-full justify-center perspective-[2000px]">
        <NavigationMenu.Viewport className="relative mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-[6px] border bg-white shadow-sm transition-[width,_height] duration-300 data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut sm:w-[var(--radix-navigation-menu-viewport-width)]" />
      </div>
    </NavigationMenu.Root>
  );
};

export const MobileNavigation = () => {
  const {data: userSession} = useSession();

  return (
    <Accordion.Root
      type="multiple"
      className="block space-y-1 rounded-md border bg-white p-5 shadow-md lg:hidden"
    >
      {headerRoutes.map((route) => {
        if (route.session === !userSession) {
          return null;
        }

        return "sublinks" in route ? (
          <Accordion.Item key={route.label} value={route.label}>
            <Accordion.Header className="flex">
              <Accordion.Trigger
                className={cn(
                  "group flex w-full flex-1 items-center justify-between rounded-md bg-white px-4 py-2 text-lg font-medium text-gray-700 outline-none hover:bg-neutral-500/10 hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
                )}
              >
                {route.label}
                <ChevronDownIcon
                  className="text-black transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>

            <Accordion.Content className="text-md px-4 py-1 text-gray-500">
              <ul className="flex flex-col gap-2">
                {route.sublinks.map((sublink) => (
                  <li key={sublink.label}>
                    <Link
                      href={sublink.href}
                      className="block w-full rounded-md px-2 py-1 hover:bg-gray-50 hover:underline"
                    >
                      {sublink.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        ) : (
          <Accordion.Item key={route.label} value={route.label}>
            <Link
              href={route.href}
              className="flex w-full items-center justify-between rounded-md px-4 py-2 text-lg font-medium text-gray-700 hover:bg-neutral-500/10 hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
            >
              {route.label}
            </Link>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
};
