import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { isAfter, isBefore } from "date-fns";

import { DeregisterButton } from "@/components/deregister-button";
import { RegisterButton } from "@/components/register-button";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { getHappeningBySlug } from "@/lib/queries/happening";
import { getRegistrationBySlug, getRegistrationBySlugAndUserId } from "@/lib/queries/registration";
import { getSpotRangeBySlug } from "@/lib/queries/spot-range";
import { getUser } from "@/lib/session";
import { type Bedpres } from "@/sanity/bedpres";
import { urlFor } from "@/utils/image-builder";

type BedpresSidebarProps = {
  slug: string;
  bedpres: Bedpres;
};

export async function BedpresSidebar({ slug, bedpres }: BedpresSidebarProps) {
  const user = await getUser();
  const { data: happeningInfo } = await getHappeningBySlug(slug);

  const isOrganizer = user && user.studentGroups.includes("BEDKOM");
  const isAdmin = user?.role === "ADMIN";

  const { data: spotRange } = await getSpotRangeBySlug(slug);

  // Check if user is registered
  const registration = user ? await getRegistrationBySlugAndUserId(slug, user.id) : null;
  const isRegistered = registration?.data?.status === "REGISTERED";

  const { data: registrations } = await getRegistrationBySlug(slug);

  const registeredCount = registrations?.filter(
    (registration) => registration.status === "REGISTERED",
  ).length;
  const waitlistCount = registrations?.filter(
    (registration) => registration.status === "WAITLISTED",
  ).length;

  const maxCapacity = spotRange?.reduce((acc, curr) => acc + curr.spots, 0);

  const isRegistrationOpen =
    happeningInfo?.registrationStart &&
    happeningInfo?.registrationEnd &&
    isAfter(new Date(), happeningInfo?.registrationStart) &&
    isBefore(new Date(), happeningInfo?.registrationEnd);

  return (
    <Sidebar>
      {!happeningInfo && (
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

      {happeningInfo?.date && (
        <SidebarItem>
          <SidebarItemTitle>Dato:</SidebarItemTitle>
          <SidebarItemContent>{happeningInfo?.date.toLocaleDateString("nb-NO")}</SidebarItemContent>
        </SidebarItem>
      )}

      {happeningInfo?.date && (
        <SidebarItem>
          <SidebarItemTitle>Tid:</SidebarItemTitle>
          <SidebarItemContent>
            {happeningInfo?.date.toLocaleTimeString("nb-NO", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {spotRange && spotRange.length > 0 && (
        <SidebarItem>
          <SidebarItemTitle>Plasser:</SidebarItemTitle>
          {spotRange.map((range) => (
            <SidebarItemContent key={range.id}>
              {range.spots} plasser for
              {range.minDegreeYear === range.maxDegreeYear ? (
                <span> {range.minDegreeYear}. trinn</span>
              ) : (
                <span>
                  {" "}
                  {range.minDegreeYear} - {range.maxDegreeYear}. trinn
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

      {happeningInfo?.registrationStart && happeningInfo.registrationStart < new Date() && (
        <SidebarItem>
          <SidebarItemTitle className="font-semibold">Påmeldte:</SidebarItemTitle>
          <SidebarItemContent>
            {registeredCount} / {maxCapacity}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {happeningInfo &&
        waitlistCount &&
        happeningInfo.registrationStart &&
        happeningInfo.registrationStart < new Date() &&
        waitlistCount > 0 && (
          <SidebarItem>
            <SidebarItemTitle>Venteliste:</SidebarItemTitle>
            <SidebarItemContent>{waitlistCount}</SidebarItemContent>
          </SidebarItem>
        )}

      {isRegistrationOpen && happeningInfo?.registrationEnd && (
        <SidebarItem>
          <SidebarItemTitle>Påmeldingsfrist:</SidebarItemTitle>
          <SidebarItemContent>
            {happeningInfo?.registrationEnd.toLocaleDateString("nb-NO")}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {!isRegistrationOpen &&
        happeningInfo?.registrationStart &&
        new Date() < happeningInfo.registrationStart && (
          <SidebarItem>
            <SidebarItemTitle>Påmelding åpner:</SidebarItemTitle>
            <SidebarItemContent>
              {happeningInfo?.registrationStart.toLocaleDateString("nb-NO")}
            </SidebarItemContent>
          </SidebarItem>
        )}

      {user && isRegistrationOpen && happeningInfo?.questions && (
        <SidebarItem>
          {isRegistered ? (
            <DeregisterButton slug={slug} />
          ) : (
            <RegisterButton slug={slug} questions={happeningInfo.questions} />
          )}
        </SidebarItem>
      )}

      {user && !isRegistrationOpen && (
        <SidebarItem>
          <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
            <p className="font-semibold">Påmelding er stengt.</p>
          </div>
        </SidebarItem>
      )}

      {!user && (
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

      {(isAdmin || isOrganizer) && (
        <SidebarItem>
          <Button fullWidth variant="link" asChild>
            <Link href={"/dashboard/" + slug}>Til Dashboard</Link>
          </Button>
        </SidebarItem>
      )}
    </Sidebar>
  );
}
