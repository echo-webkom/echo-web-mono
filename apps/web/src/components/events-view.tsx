import { type Happening } from "@/sanity/happening/schemas";
import { CombinedHappeningPreview } from "./happening-preview-box";

export default function EventsView({ happenings }: { happenings: Array<Happening> }) {
  if (!happenings) {
    return <div>Ingen arrangementer funnet</div>;
  }

  return (
    <>
      <div>
        {happenings.map((event) => (
          <ul key={event._id} className="py-1">
            <CombinedHappeningPreview happening={event} />
          </ul>
        ))}
      </div>
    </>
  );
}
