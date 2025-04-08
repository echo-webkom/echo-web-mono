import Image, { type StaticImageData } from "next/image";

import AlzheimerArena from "@/assets/images/webathon/alzheimer_arena.gif";
import BableRoyale from "@/assets/images/webathon/bable_royale.gif";
import BrainrotProcessing from "@/assets/images/webathon/brainrot.gif";
import TicTacToeChess from "@/assets/images/webathon/chess.gif";
import SmartF1 from "@/assets/images/webathon/f1.gif";
import Kompis from "@/assets/images/webathon/kompis.gif";
import Lopetid from "@/assets/images/webathon/lopetid.gif";
import Moas from "@/assets/images/webathon/moas.png";
import { Container } from "@/components/container";

type WebathonEntry = {
  name: string;
  group: string;
  img: StaticImageData;
  description: string;
  github: string;
};

function EntryCarousel({ img }: { img: StaticImageData }) {
  return (
    <div className="flex h-full w-full flex-shrink-0 items-center justify-center overflow-hidden p-4">
      <Image
        src={img}
        alt=""
        // Optionally specify width and height if possible, or use layout="responsive"
        width={0}
        height={0}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export default function WebathonShowcase() {
  const entries: Array<WebathonEntry> = [
    // Example entry; remove or replace with your actual entries.
    {
      name: "Alzheimer Arena",
      group: "Dementia Delinquents",
      img: AlzheimerArena,
      description: "Et fast-paced multiplayer minnespill med ulike buffs.",
      github: "https://github.com/h593289/webathon",
    },
    {
      name: "Bable Royale",
      group: "Flodsvin-v2",
      img: BableRoyale,
      description: "En battle royale for kebab-sultne studenter i fylla.",
      github: "https://github.com/X104n/p2p-bab",
    },
    {
      name: "Brainrot Processing",
      group: "Brainrot Studios",
      img: BrainrotProcessing,
      description: "En kolleksjon av mange mini-spill og visualiseringer.",
      github: "https://github.com/Herwal/webathon",
    },
    {
      name: "Løpetid",
      group: "Løpetid INC",
      img: Lopetid,
      description: "Løping og dating kombinert.",
      github: "https://github.com/sebastianjacmatt/Tony_montana_final_mix.mp3",
    },
    {
      name: "Møas",
      group: "Møas INC",
      img: Moas,
      description: "Fargerik prossess-monitor i terminalen.",
      github: "https://github.com/lockels/m-as",
    },
    {
      name: "Smart F1",
      group: "Smart F1 INC",
      img: SmartF1,
      description: "Alt du trenger å vite om F1 res, før, under, og etter.",
      github: "https://github.com/GardKalland/webathon",
    },
    {
      name: "Kompis",
      group: "Ninja Turtles",
      img: Kompis,
      description: "Finn din kompis for ulike fritidsaktiviteter og hobbyer.",
      github: "https://github.com/KaroGil/webathon",
    },
  ];

  return (
    <>
      <Container className="py-10">
        <Container className="flex w-full items-center justify-center p-20">
          <Image src={TicTacToeChess} alt="" width={600} height={0}></Image>
          <div className="flex flex-col items-center justify-center gap-2 p-10">
            <p className="text-center text-4xl font-bold">Vinner av Webathon 2025</p>
            <p className="text-xl">Tic Tac Toe Chess av KaffeBataljonen</p>
            <a
              href="https://github.com/henriksbreivik/multiChess"
              className="text-gray-400 hover:underline"
            >
              GitHub
            </a>
          </div>
        </Container>

        <Container className="gap-3 pb-10">
          <p className="text-2xl font-bold">Hva er dette?</p>
          <p>
            Webathon var et hackathon arrangert av Webkom. Konkurransen gikk ut på å lage det
            kuleste grafiske prosjektet som passet stikkordene &quot;raskt, smart, mange&quot;.
            Hackathonet varte fra fredag til søndag. Alle gruppene lagde fantastisk kule prosjekter
            og vi er veldig imponert med innsatsen. Vinnerlaget fikk en Raspberry Pi hver, i tillegg
            til lader og echo deksel.
          </p>
          <p>Var du ikke med nå? Bli med neste gang!</p>
        </Container>

        {entries.map((entry, index) => (
          <div
            key={index}
            className="my-4 flex flex-col items-center justify-center gap-4 rounded-lg bg-muted p-10 md:flex-row"
          >
            {/* Left: Image carousel */}
            <div className="flex w-full flex-shrink-0 justify-center md:w-1/2">
              <EntryCarousel img={entry.img} />
            </div>
            {/* Right: Text information */}
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
    </>
  );
}
