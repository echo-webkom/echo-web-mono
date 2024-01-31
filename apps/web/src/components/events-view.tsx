import Image from "next/image";

import { type Happening } from "@/sanity/happening/schemas";
import { CombinedHappeningPreview } from "./happening-preview-box";

export default function EventsView({ happenings }: { happenings: Array<Happening> }) {
  if (happenings.length === 0) {
    return (
      <div className="m-5 flex flex-col">
        <h3 className="mx-auto text-xl font-medium">Her var det tomt!</h3>
        <h3 className="mx-auto font-medium">Prøv å oppdatere filtrene.</h3>
        <Image
          className="m-5 mx-auto rounded-lg"
          src="/gif/fresh-prince-room.gif"
          alt="Fresh prince empty room"
          width={400}
          height={400}
        />
      </div>
    );
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
