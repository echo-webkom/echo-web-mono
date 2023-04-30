import {useState, type ReactNode} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import {ArrowLeftIcon} from "@radix-ui/react-icons";

import Feedback from "@/components/feedback";
import Footer from "@/components/footer";
import Header from "@/components/header";
import {adminRoutes} from "@/lib/routes";
import {cn} from "@/utils/cn";

type AdminLayoutProps = {
  title: string;
  children: ReactNode;
};

const AdminLayout = ({title, children}: AdminLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {pathname} = useRouter();

  const handleBackClick = () => {
    setIsOpen(true);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />

        <div className="relative mx-auto flex w-full max-w-[1400px]">
          {/* Sidebar */}
          <div
            className={cn("border-r bg-background p-5 md:block", {
              "hidden md:block": !isOpen,
              "absolute block w-full md:block": isOpen,
            })}
          >
            <aside className="w-full overflow-hidden">
              <nav className="flex flex-col">
                <ul className="flex flex-col gap-1">
                  {adminRoutes.map((route) => (
                    <li key={route.href}>
                      <Link
                        className={cn(
                          "flex rounded-lg px-3 py-1 text-lg font-medium hover:bg-muted",
                          {
                            "bg-muted": isActive(route.href),
                          },
                        )}
                        href={route.href}
                      >
                        {route.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>

          {/* Page title */}
          <div
            className={cn("flex w-full flex-col", {
              "hidden md:block": isOpen,
            })}
          >
            <div className="flex gap-3 border-b p-5">
              <button onClick={handleBackClick} className="block md:hidden">
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-semibold">{title}</h1>
            </div>

            {/* Page content */}
            <main className="p-5">{children}</main>
          </div>
        </div>

        <Feedback />

        <Footer className="mt-auto" />
      </div>
    </>
  );
};

export default AdminLayout;
