

import Julequiz from "./Quiz";
import type {Sporsmaal} from "./Quiz";

const quizSporsmaal: Sporsmaal[] = [
  {
    tekst: "Omtrent hvor mange tonn klementiner spises det i Norge hvert år?",
    alternativer: ["10 000", "3000", "18 000", "27 000"],
    riktig: 3,
  },
  {
    tekst: "Hvor mange land har jul som nasjonalt anerkjent eller offisiell høytid?",
    alternativer: ["150", "196", "100", "137"],
    riktig: 0,
  },
  {
    tekst: "Hvilken av følgende julekalendre kom først?",
    alternativer: ["The Julekalender", "Nissene på låven", "Jul på Månetoppen", "Jul i Blåfjell"],
    riktig: 0,
  },
  {
    tekst: "Hvilken dag i julen er det engelskmennene kaller Boxing Day?",
    alternativer: ["27.12", "26.12", "28.12", "30.12"],
    riktig: 1,
  },
  {
    tekst: "Hva er sannsynligheten for snø på julaften i Bergen?",
    alternativer: ["< 7%", "< 39%", "< 23%", "< 15%"],
    riktig: 2,
  },
];

export default function Luke02(){
  return(
    <div>
      <Julequiz sporsmaal={quizSporsmaal}/>
    </div>
  );
}