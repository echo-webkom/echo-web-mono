import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale/nb";
import { ChevronRight } from "lucide-react";

import { ParticlesBackdrop } from "@/components/animations/particles";
import { Reveal } from "@/components/animations/reveal";
import { BlurLogo } from "@/components/blur-logo";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { createHappeningLink } from "@/lib/create-link";
import { ensureAnonymous } from "@/lib/ensure";
import { fetchHomeHappenings } from "@/sanity/happening";
import { cn } from "@/utils/cn";
import { Banner } from "./hjem/_components/banner";

export default async function HomePage() {
  await ensureAnonymous({
    redirectTo: "/hjem",
  });

  const [bedpresses, events] = await Promise.all([
    fetchHomeHappenings(["bedpres"], 4),
    fetchHomeHappenings(["event", "external"], 4),
  ]);

  const studieretninger: Record<string, Record<string, string>> = {
    Bachelor: {
      Datateknologi: "https://www4.uib.no/studier/program/informatikk-datateknologi-bachelor",
      Datasikkerhet: "https://www4.uib.no/studier/program/informatikk-datasikkerhet-bachelor",
      "Informatikk-matematikk-økonomi":
        "https://www4.uib.no/studier/program/informatikk-matematikk-okonomi-bachelor",
      Bioinformatikk: "https://www4.uib.no/studier/program/informatikk-bioinformatikk-bachelor",
      "Geofag og informatikk": "https://www4.uib.no/studier/program/geofag-og-informatikk-bachelor",
    },
    Master: { Informatikk: "https://www4.uib.no/studier/program/informatikk-master" },
    Årsstudium: { Informatikk: "https://www4.uib.no/studier/program/informatikk-arsstudium" },
  };

  return (
    <>
      <div className="z-10">
        <Banner />
      </div>

      {/* Prevents scrolling on the body when the blur logo is outside the viewport // No idea why
      this works, but it does */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 left-1/2 -z-10 h-full min-h-screen w-[1200px] -translate-x-1/2">
          <BlurLogo
            className="animate-float-rotate-reverse-[-8]"
            width={400}
            height={400}
            style={{
              top: 10,
              right: 20,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <BlurLogo
            className="animate-float-rotate-[6]"
            width={300}
            height={300}
            style={{
              top: 250,
              left: 30,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
          <BlurLogo
            className="animate-float-rotate-reverse-[6]"
            width={250}
            height={250}
            style={{
              top: 450,
              right: 120,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />

          <BlurLogo
            className="animate-float-rotate-reverse-[6]"
            width={250}
            height={250}
            style={{
              top: 750,
              left: 370,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <ParticlesBackdrop />

        <Container>
          <div className="mt-32 mb-24 space-y-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8">
                <h1 className="text-4xl font-semibold text-gray-700 sm:text-5xl dark:text-gray-200">
                  echo – Linjeforeningen for informatikk
                </h1>
              </div>
              <Reveal>
                <p className="text-muted-foreground mx-auto max-w-3xl font-medium md:text-xl">
                  Vi i echo jobber med å gjøre studiehverdagen for informatikkstudenter bedre ved å
                  arrangere sosiale og faglige arrangementer.
                </p>
              </Reveal>
            </div>

            <Reveal>
              <div className="flex justify-center gap-4">
                <Button variant="secondary" asChild>
                  <Link href="/auth/logg-inn">Logg inn</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/om/echo">Les mer om echo</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="mx-auto mt-10 max-w-4xl space-y-32">
            <div className="grid items-center gap-16 md:grid-cols-2">
              {/* TODO: Add image of students */}
              <Reveal translateX={200}>
                <p className="mb-4 text-2xl font-semibold">Hva er echo?</p>

                <p>
                  echo består av frivillige informatikkstudenter, og er delt inn i et hovedstyre og
                  en rekke undergrupper, komiteer og interesseorganisasjoner. Hovedstyret vårt
                  består av sju demokratisk valgte studenter og syv representanter fra
                  undergruppere. Vi er linjeforeningen for informatikk ved Universitetet i Bergen,
                  men har også et overordnet ansvar for studentsaker som angår det faglige ved
                  instituttet.
                </p>
              </Reveal>

              <Reveal translateX={-200}>
                <p className="mb-4 text-2xl font-semibold">For bedrifter</p>

                <p className="mb-8">
                  Vi tilbyr også muligheten for bedrifter til å presentere seg for
                  informatikkstudentene ved Universitetet i Bergen. Dette kan gjøres gjennom
                  bedriftspresentasjoner, workshops, kurs og andre arrangementer. Vi tilbyr også
                  muligheten for bedrifter å annonsere ledige stillinger og internship på nettsiden
                  vår.
                </p>

                <Link
                  className="text-primary font-medium hover:underline"
                  href="/for-bedrifter/bedriftspresentasjon"
                >
                  Les om bedriftspresentasjoner &rarr;
                </Link>
              </Reveal>
            </div>

            <div className="grid gap-16 sm:grid-cols-2">
              <Reveal translateX={-200}>
                <h2 className="mb-4 text-xl font-semibold">Arrangementer</h2>

                {events.length > 0 ? (
                  <ul>
                    {events.map((event) => (
                      <li key={event._id} className="flex items-center justify-between gap-2">
                        <Link
                          href={createHappeningLink(event)}
                          className="truncate hover:underline"
                        >
                          {event.title}
                        </Link>
                        <p className="text-muted-foreground text-nowrap">
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
                <h2 className="mb-4 text-xl font-semibold">Bedriftpresentasjoner</h2>

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
                        <p className="text-muted-foreground text-nowrap">
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
            {/* <div className="flex justify-center"> */}
            <Reveal translateX={200}>
              <div
                className={cn(
                  "relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md",
                  "dark:border-white/10 dark:bg-white/[0.03]",
                )}
              >
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]">
                  <div className="bg-primary/15 absolute -top-20 left-10 h-48 w-72 rounded-full blur-2xl" />
                  <div className="bg-primary/10 absolute right-10 -bottom-24 h-56 w-72 rounded-full blur-3xl" />
                </div>

                <h3 className="mb-8 text-center text-2xl font-semibold">Studieretninger</h3>

                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                  {Object.entries(studieretninger).map(([degree, programs]) => (
                    <div key={degree}>
                      <div className="mb-3 flex items-center gap-2">
                        <div className="bg-primary/70 ring-primary/20 size-2 rounded-full ring-2" />
                        <h4 className="text-lg font-semibold">{degree}</h4>
                      </div>

                      <ul className="divide-border/60 border-border/60 bg-background/40 divide-y rounded-xl border">
                        {Object.entries(programs).map(([programName, programLink], i) => (
                          <li
                            key={programName}
                            className={cn("px-3", i === 0 ? "pt-2.5 pb-1.5" : "py-1.5")}
                          >
                            <Link
                              href={programLink}
                              className="group flex items-center gap-3 py-1.5"
                            >
                              <span className="bg-primary/70 ring-primary/20 relative mt-[2px] size-1.5 rounded-full ring-2 transition group-hover:scale-110" />
                              <span className="text-primary underline-offset-4 group-hover:underline">
                                {programName}
                              </span>
                              <ChevronRight className="ml-auto size-4 translate-x-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            {/* </div> */}
          </div>
        </Container>
      </div>
    </>
  );
}
