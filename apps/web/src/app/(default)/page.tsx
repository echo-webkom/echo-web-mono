import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale/nb";
import { LuArrowRight as ArrowRight } from "react-icons/lu";

import EchoLogo from "@/assets/images/echo-logo.png";
import { Reveal } from "@/components/animations/reveal";
import { BlurLogo } from "@/components/blur-logo";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { createHappeningLink } from "@/lib/create-link";
import { ensureAnonymous } from "@/lib/ensure";
import { fetchHomeHappenings } from "@/sanity/happening";

export default async function HomePage() {
  await ensureAnonymous({
    redirectTo: "/hjem",
  });

  const [bedpresses, events] = await Promise.all([
    fetchHomeHappenings(["bedpres"], 4),
    fetchHomeHappenings(["event", "external"], 4),
  ]);

  return (
    // Prevents scrolling on the body when the blur logo is outside the viewport
    // No idea why this works, but it does
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 left-1/2 -z-10 h-full min-h-screen w-[1200px] -translate-x-1/2">
        <BlurLogo
          className="animate-float-rotate-reverse-[-8]"
          width={400}
          height={400}
          top={10}
          right={20}
        />
        <BlurLogo
          className="animate-float-rotate-[6]"
          width={300}
          height={300}
          top={250}
          left={30}
        />
        <BlurLogo
          className="animate-float-rotate-reverse-[6]"
          width={250}
          height={250}
          top={450}
          right={120}
        />

        <BlurLogo
          className="animate-float-rotate-reverse-[6]"
          width={250}
          height={250}
          top={750}
          left={370}
        />
      </div>

      <Container>
        <div className="mb-24 mt-32 space-y-6">
          <div className="mx-auto max-w-screen-md text-center">
            <h1 className="mb-8 text-4xl font-medium sm:text-5xl md:text-6xl">
              echo – Linjeforeningen for informatikk
            </h1>
            <Reveal>
              <p className="mx-auto max-w-screen-md md:text-xl">
                Vi i echo jobber med å gjøre studiehverdagen for informatikkstudenter bedre ved å
                arrangere sosiale og faglige arrangementer.
              </p>
            </Reveal>
          </div>

          <Reveal>
            <div className="flex justify-center gap-4">
              <Button className="hover:" variant="secondary" asChild>
                <Link href="/auth/logg-inn">Logg inn</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/om/echo">Les mer om echo</Link>
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-10 max-w-screen-lg space-y-32">
          {/* TODO: REMOVE ME */}
          <Link className="group" href="/for-studenter/innlegg/info-til-nye-studenter">
            <div className="relative rounded-lg bg-secondary px-6 py-8 shadow-md transition-all group-hover:bg-secondary-hover">
              <h2 className="mb-4 text-center text-2xl font-medium text-secondary-foreground group-hover:underline">
                👋🏻 Informasjon til nye studenter
              </h2>
              <p className="text-center text-secondary-foreground">
                Vi har laget et innlegg med svar på spørsmål du kanskje har om echo. Sjekk det ut!
              </p>
            </div>
          </Link>
          {/* END REMOVE ME */}

          <div className="grid items-center gap-16 md:grid-cols-2">
            {/* TODO: Add image of students */}
            <Reveal className="flex items-center justify-center" translateX={-200}>
              <Image src={EchoLogo} alt="Happy students" height={300} width={200} />
            </Reveal>
            <Reveal translateX={200}>
              <p className="mb-4 text-2xl font-medium">Hva er echo?</p>

              <p>
                echo består av frivillige informatikkstudenter, og er delt inn i et hovedstyre og en
                rekke undergrupper, komiteer og interesseorganisasjoner. Hovedstyret vårt består av
                fem demokratisk valgte studenter og syv representanter fra undergruppere. Vi er
                linjeforeningen for informatikk ved Universitetet i Bergen, men har også et
                overordnet ansvar for studentsaker som angår det faglige ved instituttet.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-16 sm:grid-cols-2">
            <Reveal translateX={-200}>
              <h2 className="mb-4 text-xl font-medium">Arrangementer</h2>

              {events.length > 0 ? (
                <ul>
                  {events.map((event) => (
                    <li key={event._id} className="flex items-center justify-between gap-2">
                      <Link href={createHappeningLink(event)} className="truncate hover:underline">
                        {event.title}
                      </Link>
                      <p className="text-nowrap text-muted-foreground">
                        {format(new Date(event.date), "EEE. dd.MM", {
                          locale: nb,
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Det er ingen kommende arrangementer</p>
              )}
            </Reveal>

            <Reveal translateX={200}>
              <h2 className="mb-4 text-xl font-medium">Bedriftpresentasjoner</h2>

              {bedpresses.length > 0 ? (
                <ul>
                  {bedpresses.map((bedpres) => (
                    <li key={bedpres._id} className="flex items-center justify-between gap-2">
                      <Link
                        href={createHappeningLink(bedpres)}
                        className="truncate hover:underline"
                      >
                        {bedpres.title}
                      </Link>
                      {/* <p className="text-nowrap text-muted-foreground">ti. 02.04</p> */}
                      <p className="text-nowrap text-muted-foreground">
                        {format(new Date(bedpres.date), "EEE. dd.MM", {
                          locale: nb,
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Det er ingen kommende bedriftspresentasjoner</p>
              )}
            </Reveal>
          </div>

          <div className="grid gap-16 md:grid-cols-2">
            <div></div>
            <Reveal translateX={-200}>
              <p className="mb-4 text-2xl font-medium">For bedrifter</p>

              <p className="mb-8">
                Vi tilbyr også muligheten for bedrifter til å presentere seg for
                informatikkstudentene ved Universitetet i Bergen. Dette kan gjøres gjennom
                bedriftspresentasjoner, workshops, kurs og andre arrangementer. Vi tilbyr også
                muligheten for bedrifter å annonsere ledige stillinger og internship på nettsiden
                vår.
              </p>

              <Link
                className="font-medium text-primary hover:underline"
                href="/for-bedrifter/bedriftspresentasjon"
              >
                Les om bedriftspresentasjoner &rarr;
              </Link>
            </Reveal>

            {/* TODO: Add image */}
            {/* <Reveal className="flex items-center justify-start" translateX={200}>
              <Image src={HappyBoss} alt="Happy boss" height={350} width={350} />
            </Reveal> */}
          </div>
        </div>
      </Container>
    </div>
  );
}
