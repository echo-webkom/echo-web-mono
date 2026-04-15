import Grinder from "@/assets/images/webathon/2026/grinder.gif";
import StudentWhere from "@/assets/images/webathon/2026/studentwhere.gif";
import Venue from "@/assets/images/webathon/2026/venue.gif";

import WebathonEntryList, { type WebathonEntryListProps } from "../entry-list";

const entries: WebathonEntryListProps = {
  year: "2026",
  winner: {
    name: "Venue",
    group: "",
    img: Venue,
    description: "Finn, lag, og delta i arrangementer med andre",
    github: "https://github.com/jonasjus/webathon",
  },
  other: [
    {
      name: "Grinder",
      group: "",
      img: Grinder,
      description: "Grind med dine medstudenter. Gjør oppgaver og obliger for å ikke dø!",
      github: "https://github.com/steffenap/webathon-ballmers-valley",
    },
    {
      name: "StudentWhere",
      group: "",
      img: StudentWhere,
      description: "Finn arrangementer på kart og lag dine egne.",
      github: "https://github.com/joskoglund/webathon",
    },
  ],
};

export default function Webathon2026() {
  return <WebathonEntryList props={entries} />;
}
