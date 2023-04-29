import {type ReactNode} from "react";
import Link from "next/link";
import {useRouter} from "next/router";

import Feedback from "@/components/feedback";
import Footer from "@/components/footer";
import Header from "@/components/header";
import {adminRoutes} from "@/lib/routes";
import {cn} from "@/utils/cn";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({children}: AdminLayoutProps) => {
  const {pathname} = useRouter();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex">
          <aside className="left-0 top-0 z-40 w-64 -translate-x-full border-r transition-transform sm:translate-x-0">
            <div className="h-full overflow-y-auto bg-gray-50 px-3 py-4">
              <ul className="flex flex-col gap-3">
                {adminRoutes.map((route) => (
                  <li key={`${route.href}${route.label}`} className="flex">
                    <Link
                      className={cn("w-full rounded-lg px-3 py-2 hover:bg-gray-200", {
                        "bg-gray-200 font-semibold": isActive(route.href),
                      })}
                      href={route.href}
                    >
                      {route.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <main className="p-5 md:p-10">{children}</main>
        </div>
        <Feedback />
        <Footer className="mt-auto" />
      </div>
    </>
  );
};

export default AdminLayout;
