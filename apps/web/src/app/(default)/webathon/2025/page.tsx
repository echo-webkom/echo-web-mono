import AlzheimerArena from "@/assets/images/webathon/alzheimer_arena.gif";
import BableRoyale from "@/assets/images/webathon/bable_royale.gif";
import BrainrotProcessing from "@/assets/images/webathon/brainrot.gif";
import TicTacToeChess from "@/assets/images/webathon/chess.gif";
import SmartF1 from "@/assets/images/webathon/f1.gif";
import Kompis from "@/assets/images/webathon/kompis.gif";
import Lopetid from "@/assets/images/webathon/lopetid.gif";
import Moas from "@/assets/images/webathon/moas.png";

import WebathonEntryList, { type WebathonEntryListProps } from "../entry-list";

const entries: WebathonEntryListProps = {
  year: "2025",
  winner: {
    name: "Tic Tac Toe Chess",
    group: "KaffeBataljonen",
    img: TicTacToeChess,
    description: "Sjakk og TicTacToe kombineres i dette høy-intensitet multiplayer spillet",
    github: "https://github.com/henriksbreivik/multiChess",
  },
  other: [
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
  ],
};

export default function Webathon2025() {
  return <WebathonEntryList props={entries} />;
}
