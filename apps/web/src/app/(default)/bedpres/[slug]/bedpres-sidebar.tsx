import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon } from "@radix-ui/react-icons";

import { yearToNumber } from "@echo-webkom/lib";
import { getHappening, getSpotRangeByHappening } from "@echo-webkom/storage";

import { DeregisterButton } from "@/components/deregister-button";
import { RegisterButton } from "@/components/register-button";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { getSession } from "@/lib/session";
import { type Bedpres } from "@/sanity/bedpres";
import { urlFor } from "@/utils/image-builder";

type BedpresSidebarProps = {
  slug: string;
  bedpres: Bedpres;
};

export async function BedpresSidebar({ slug, bedpres }: BedpresSidebarProps) {
  // Get user
  // Check if user is organizer
  // Check if user is admin
  // Check if user is registered
  // Get spot ranges
  // Check if registration is open

  const session = await getSession();
  const happening = await getHappening(slug);
  const spotRanges = await getSpotRangeByHappening(slug);

  const isRegistered = false;
  const isRegistrationOpen =
    happening?.registrationStart &&
    happening.registrationStart < new Date() &&
    (!happening.registrationEnd || happening.registrationEnd > new Date());

  return (
    <Sidebar>
      {!happening && (
        <SidebarItem>
          <div className="border-l-4 border-red-500 bg-red-200 p-4 text-red-700">
            <p className="font-semibold">Fant ikke bedriftspresentasjonen.</p>
          </div>
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
          <SidebarItemContent>{happening?.date.toLocaleDateString("nb-NO")}</SidebarItemContent>
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

      {happening.spotRanges && happening.spotRanges.length > 0 && (
        <SidebarItem>
          <SidebarItemTitle>Plasser:</SidebarItemTitle>
          {spotRanges.map((sr) => (
            <SidebarItemContent key={`${sr.minYear}${sr.maxYear}`}>
              {sr.registrations} / {sr.spots} for
              {sr.minYear === sr.maxYear ? (
                <span> {yearToNumber(sr.minYear)}. trinn</span>
              ) : (
                <span>
                  {" "}
                  {yearToNumber(sr.minYear)} - {yearToNumber(sr.maxYear)}. trinn
                </span>
              )}
            </SidebarItemContent>
          ))}
        </SidebarItem>
      )}

      {bedpres.location?.name && (
        <SidebarItem>
          <SidebarItemTitle className="font-semibold">Sted:</SidebarItemTitle>
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

      {/* {happening &&
        waitlistCount &&
        happening.registrationStart &&
        happening.registrationStart < new Date() &&
        waitlistCount > 0 && (
          <SidebarItem>
            <SidebarItemTitle>Venteliste:</SidebarItemTitle>
            <SidebarItemContent>{waitlistCount}</SidebarItemContent>
          </SidebarItem>
        )} */}

      {isRegistrationOpen && happening?.registrationEnd && (
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

      {session && isRegistrationOpen && happening?.questions && (
        <SidebarItem>
          {isRegistered ? (
            <DeregisterButton slug={slug} />
          ) : (
            <RegisterButton slug={slug} questions={happening.questions} />
          )}
        </SidebarItem>
      )}

      {session && !isRegistrationOpen && (
        <SidebarItem>
          <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
            <p className="font-semibold">Påmelding er stengt.</p>
          </div>
        </SidebarItem>
      )}

      {!session && (
        <SidebarItem>
          <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
            <p className="mb-3 font-semibold">Du må logge inn for å melde deg på.</p>
            <div className="flex items-center">
              <Link href="/api/auth/signin" className="hover:underline">
                Logg inn her
              </Link>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </div>
          </div>
        </SidebarItem>
      )}

      {/* {(isAdmin || isOrganizer) && (
        <SidebarItem>
          <Button fullWidth variant="link" asChild>
            <Link href={"/dashboard/" + slug}>Til Dashboard</Link>
          </Button>
        </SidebarItem>
      )} */}
    </Sidebar>
  );
}
