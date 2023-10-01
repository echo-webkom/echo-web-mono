import { getSession } from "@/lib/session";
import {
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
      {/* <DatabaseStatusBar /> */}
      <Header>
        <TopMenu>
          <HeaderLogo />
          <NavigationMenu>
            {session ? (
              <>
                <NavigationMenuItem to="/auth/profil">Se profil</NavigationMenuItem>
                <NavigationMenuItem to="/auth/logg-ut">Logg ut</NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem to="/auth/logg-inn">Logg inn</NavigationMenuItem>
                <NavigationMenuItem to="/auth/lag-bruker">Lag bruker</NavigationMenuItem>
              </>
            )}
            <MobileNavigation />
          </div>
        </header>
      </div>
    </div>
  );
}

// async function DatabaseStatusBar() {
//   const status = await getDatabaseStatus();

//   if (!status) {
//     return (
//       <div className="bg-red-400 p-2 text-center text-sm font-medium">
//         <p>
//           Webkom har mistet kontakt med databasen. Dette er ikke bra. Vi jobber med å fikse det.
//         </p>
//       </div>
//     );
//   }

//   return null;
// }
