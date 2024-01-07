import { fetchFilteredHappening } from "@/sanity/happening";
import { type Query } from "./event-filter";
import { CombinedHappeningPreview } from "./happening-preview-box";

export default async function EventsView(query: Query) {
  const happenings = await fetchFilteredHappening(query);

  if (!happenings) {
    return <div>Ingen arrangementer funnet</div>;
  }

  if (!query.past) {
    happenings.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0;
    });
  } else {
    happenings.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
  }

  return (
    <>
      {happenings.length > 0 && (
        <div>
          {happenings.map((event) => (
            <ul key={event._id} className="py-1">
              <CombinedHappeningPreview happening={event} />
            </ul>
          ))}
        </div>
      )}
    </>
  );
}
