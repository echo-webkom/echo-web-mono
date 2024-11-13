import { getRegistrationsByHappeningId } from "@/data/registrations/queries";
import { getSpotRangeByHappeningId } from "@/data/spotrange/queries";
import { fetchHappeningBySlug } from "@/sanity/happening";
import { isBetween, norwegianDateString } from "@/utils/date";
import { mailTo } from "@/utils/prefixes";
import { capitalize } from "@/utils/string";

type HappeningInfoBoxProps = {
  slug: string;
};

export const HappeningInfoBox = async ({ slug }: HappeningInfoBoxProps) => {
  const happening = await fetchHappeningBySlug(slug);

  if (!happening) {
    return null;
  }

  const isRegistrationOpen =
    happening.registrationStart &&
    happening.registrationEnd &&
    isBetween(new Date(happening.registrationStart), new Date(happening.registrationEnd));

  const spotRanges = await getSpotRangeByHappeningId(happening._id);
  const registrations = await getRegistrationsByHappeningId(happening._id);

  const maxCapacity = spotRanges.reduce((acc, curr) => acc + curr.spots, 0);
  const capacity = `${registrations.length}/${maxCapacity}`;

  return (
    <div className="flex h-full items-center gap-5 overflow-x-auto rounded-xl border p-5 sm:rounded-lg">
      <div className="overflow-x-hidden">
        <h1 className="line-clamp-1 text-lg font-semibold md:text-2xl">
          {capitalize(happening.title)}
        </h1>
        <p className="text-sm md:text-base">Arrangement</p>

        <div className="py-4">
          <div>Sted: {happening.location?.name ? happening.location.name : "Ikke bestemt"}</div>
          <div>Kapasitet: {capacity}</div>
          <div>Publisert: {norwegianDateString(happening._createdAt)}</div>
          <div>Sist oppdatert: {norwegianDateString(happening._updatedAt)}</div>
          <div>
            Kontakt:{" "}
            {happening.contacts?.map((oregano) => (
              <a
                key={oregano.profile._id}
                href={mailTo(oregano.email)}
                className="text-blue-600 hover:underline"
              >
                {oregano.profile.name}{" "}
              </a>
            )) ?? "Ikke angitt"}
          </div>
          <div>
            Påmelding:{" "}
            {isRegistrationOpen ? (
              <span className="text-green-600">Åpen</span>
            ) : (
              <span className="text-red-600">Lukket</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
