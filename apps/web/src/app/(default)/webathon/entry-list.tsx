import Image, { type StaticImageData } from "next/image";

import { Container } from "../../../components/container";

type WebathonEntry = {
  name: string;
  group: string;
  img: StaticImageData;
  description: string;
  github: string;
};

export type WebathonEntryListProps = {
  year: string;
  winner: WebathonEntry;
  other: Array<WebathonEntry>;
};

function EntryCarousel({ img }: { img: StaticImageData }) {
  return (
    <div className="flex h-full w-full shrink-0 items-center justify-center overflow-hidden p-4">
      <Image src={img} alt="" width={0} height={0} className="h-full w-full object-contain" />
    </div>
  );
}

export default function WebathonEntryList({
  props: { winner, other, year },
}: {
  props: WebathonEntryListProps;
}) {
  return (
    <Container className="py-10">
      <Container className="flex w-full items-center justify-center p-20">
        <Image src={winner.img} alt="" width={600} height={0}></Image>
        <div className="flex flex-col items-center justify-center gap-2 p-10">
          <p className="text-xl opacity-50">Vinner av Webathon {year}</p>
          <p className="text-center text-4xl font-bold">{winner.name}</p>
          <p>{winner.description}</p>
          <a href={winner.github} className="text-gray-400 hover:underline">
            GitHub
          </a>
        </div>
      </Container>

      <Container className="gap-3 pb-10">
        <p className="text-2xl font-bold">Hva er dette?</p>
        <p>
          Webathon er et hackathon arrangert av Webkom. Konkurransen går ut på å lage det kuleste
          grafiske prosjektet som passer er gitt tema. Hackathonet varer fra fredag til søndag.
          Vinnerlaget får en heftig premie og blir lagt til i Webathon Hall of Fame.
        </p>
        <p>Var du ikke med nå? Bli med neste gang!</p>
      </Container>

      {other.map((entry, index) => (
        <div
          key={index}
          className="bg-muted my-4 flex flex-col items-center justify-center gap-4 rounded-lg p-10 md:flex-row"
        >
          <div className="flex w-full shrink-0 justify-center md:w-1/2">
            <EntryCarousel img={entry.img} />
          </div>
          <div className="flex w-full flex-col gap-2 md:w-1/2">
            <h2 className="text-3xl font-bold">{entry.name}</h2>
            <p className="text-lg">{entry.description}</p>
            <a
              href={entry.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      ))}
    </Container>
  );
}
