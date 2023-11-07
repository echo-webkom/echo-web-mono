import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { isAfter, isBefore } from "date-fns";
import { eq } from "drizzle-orm";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";

import { AddToCalender } from "@/components/add-to-calender";
import { DeregisterButton } from "@/components/deregister-button";
import { RegisterButton } from "@/components/register-button";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { Callout } from "@/components/typography/callout";
import { type Bedpres } from "@/sanity/bedpres";
import { urlFor } from "@/utils/image-builder";

type BedpresSidebarProps = {
  slug: string;
  bedpres: Bedpres;
};

export async function BedpresSidebar({ slug, bedpres }: BedpresSidebarProps) {
  const user = await getAuth();
  const happening = await db.query.happenings.findFirst({
    where: (event) => eq(event.slug, slug),
    with: {
      questions: true,
    },
  });
  const spotRanges = await db.query.spotRanges.findMany({
    where: (spotRange) => eq(spotRange.happeningSlug, slug),
  });
  const registrations = await db.query.registrations.findMany({
    where: (registration) => eq(registration.happeningSlug, slug),
    with: {
      user: true,
    },
  });

  const isRegistered = registrations.some(
    (registration) =>
      registration.user.id === user?.id &&
      (registration.status === "registered" || registration.status === "waiting"),
  );
  const maxCapacity = spotRanges.reduce((acc, curr) => acc + (curr.spots ?? 0), 0);
  const registeredCount = registrations.filter(
    (registration) => registration.status === "registered",
  ).length;
  const waitlistCount = registrations.filter(
    (registration) => registration.status === "waiting",
  ).length;

  const isRegistrationOpen =
    happening?.registrationStart &&
    happening?.registrationEnd &&
    isAfter(new Date(), happening.registrationStart) &&
    isBefore(new Date(), happening.registrationEnd);

  const isUserComplete = user?.degreeId && user.year;

  return (
    <Sidebar>
      {!happening && (
        <SidebarItem>
          <Callout type="warning" noIcon>
            <p className="font-semibold">Fant ikke arrangementet.</p>
            <p>Kontakt Webkom!</p>
          </Callout>
        </SidebarItem>
      )}

      <SidebarItem>
        <Link href={bedpres.company.website}>
          <div className="overflow-hidden">
            <div className="relative aspect-square w-full">
              <Image
                src={urlFor(bedpres.company.image).url()}
                alt={`${bedpres.company.name} logo`}
                fill
              />
            </div>
          </div>
        </Link>
      </SidebarItem>

      <SidebarItem>
        <SidebarItemTitle>Bedrift:</SidebarItemTitle>
        <SidebarItemContent>
          <Link className="hover:underline" href={bedpres.company.website}>
            {bedpres.company.name}
            <ExternalLinkIcon className="ml-1 inline-block h-4 w-4" />
          </Link>
        </SidebarItemContent>
      </SidebarItem>

      {happening?.date && (
        <SidebarItem>
          <SidebarItemTitle>Dato:</SidebarItemTitle>
          <SidebarItemContent>
            <AddToCalender date={happening?.date} title={happening?.title} />
          </SidebarItemContent>
        </SidebarItem>
      )}

      {happening?.date && (
        <SidebarItem>
          <SidebarItemTitle>Tid:</SidebarItemTitle>
          <SidebarItemContent>
            {happening?.date.toLocaleTimeString("nb-NO", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {spotRanges.length > 0 && (
        <SidebarItem>
          <SidebarItemTitle>Plasser:</SidebarItemTitle>
          {spotRanges.map((range) => (
            <SidebarItemContent key={range.id}>
              {range.spots || "Uendelig"} plasser for
              {range.minYear === range.maxYear ? (
                <span> {range.minYear}. trinn</span>
              ) : (
                <span>
                  {" "}
                  {range.minYear} - {range.maxYear}. trinn
                </span>
              )}
            </SidebarItemContent>
          ))}
        </SidebarItem>
      )}

      {bedpres.location && (
        <SidebarItem>
          <SidebarItemTitle>Sted:</SidebarItemTitle>
          <SidebarItemContent>{bedpres.location.name}</SidebarItemContent>
        </SidebarItem>
      )}

      {bedpres.contacts && bedpres.contacts.length > 0 && (
        <SidebarItem>
          <SidebarItemTitle>Kontaktpersoner:</SidebarItemTitle>
          <SidebarItemContent>
            <ul>
              {bedpres.contacts.map((contact) => (
                <li key={contact.profile._id}>
                  <a className="hover:underline" href={"mailto:" + contact.email}>
                    {contact.profile.name}
                  </a>
                </li>
              ))}
            </ul>
          </SidebarItemContent>
        </SidebarItem>
      )}

      {happening?.registrationStart && isAfter(new Date(), happening.registrationStart) && (
        <SidebarItem>
          <SidebarItemTitle>Påmeldte:</SidebarItemTitle>
          <SidebarItemContent>
            {registeredCount} / {maxCapacity || <span className="italic">Uendelig</span>}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {happening?.registrationStart &&
        happening.registrationStart < new Date() &&
        waitlistCount > 0 && (
          <SidebarItem>
            <SidebarItemTitle>Venteliste:</SidebarItemTitle>
            <SidebarItemContent>{waitlistCount}</SidebarItemContent>
          </SidebarItem>
        )}

      {isRegistrationOpen && happening.registrationEnd && (
        <SidebarItem>
          <SidebarItemTitle>Påmeldingsfrist:</SidebarItemTitle>
          <SidebarItemContent>
            {happening?.registrationEnd.toLocaleDateString("nb-NO")}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {!isRegistrationOpen &&
        happening?.registrationStart &&
        new Date() < happening.registrationStart && (
          <SidebarItem>
            <SidebarItemTitle>Påmelding åpner:</SidebarItemTitle>
            <SidebarItemContent>
              {happening?.registrationStart.toLocaleDateString("nb-NO")}
            </SidebarItemContent>
          </SidebarItem>
        )}

      {user && isRegistrationOpen && isUserComplete && (
        <SidebarItem>
          {isRegistered ? (
            <DeregisterButton slug={slug} />
          ) : (
            <RegisterButton slug={slug} questions={happening.questions} />
          )}
        </SidebarItem>
      )}

      {user && !isRegistrationOpen && (
        <SidebarItem>
          <Callout type="warning" noIcon>
            <p className="font-semibold">Påmelding er stengt.</p>
          </Callout>
        </SidebarItem>
      )}

      {user && !isUserComplete && (
        <SidebarItem>
          <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
            <p className="mb-3 font-semibold">Du må fullføre brukeren din.</p>
            <div className="group flex items-center">
              <Link href="/auth/profil" className="hover:underline">
                Her
                <ArrowRightIcon className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </SidebarItem>
      )}

      {!user && (
        <SidebarItem>
          <Callout type="warning" noIcon>
            <p className="mb-3 font-semibold">Du må logge inn for å melde deg på.</p>
            <div className="group flex items-center">
              <Link href="/auth/logg-inn" className="hover:underline">
                Logg inn her
                <ArrowRightIcon className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </Callout>
        </SidebarItem>
      )}

      {/* TODO CHECK IF USER IS ADMIN OR ORGANIZER */}
    </Sidebar>
  );
}
