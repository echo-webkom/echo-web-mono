import Link from "next/link";

import {Container} from "@/components/container";
import {Footer} from "@/components/footer";
import {SiteHeader} from "@/components/site-header";
import {Button} from "@/components/ui/button";
import {getSession} from "@/lib/session";
import {Content} from "./content";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex w-full flex-grow flex-col">
        <div className="relative">
          <div className="bg-banner">
            <SiteHeader />
          </div>
          <Container className="relative bg-banner pb-40 pt-24" layout="full">
            <div className="mx-auto w-full max-w-screen-xl text-white">
              <div className="max-w-xl space-y-8">
                <h1>
                  <span className="text-xl font-medium sm:text-3xl">Velkommen til</span>
                  <br />
                  <span className="text-4xl font-bold sm:text-5xl">
                    echo &ndash; Linjeforeningen for informatikk
                  </span>
                </h1>
                <p>
                  Vi jobber utelukkende med å gjøre studiehverdagen for oss informatikere bedre og
                  er studentenes stemme opp mot instituttet, fakultetet og arbeidsmarkedet.
                </p>
                <div>
                  <Button asChild variant="secondary">
                    {(await getSession()) ? (
                      <Link href="/auth/profile">Min profil</Link>
                    ) : (
                      <Link href="/auth/sign-in">Logg inn</Link>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Container>

          <Content />
        </div>
      </main>
      <Footer />
    </div>
  );
}
