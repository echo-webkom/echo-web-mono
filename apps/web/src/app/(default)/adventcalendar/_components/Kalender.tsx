import { Luke } from "./ILukeEgenskaper";
import type { ILukeEgenskaper } from "./ILukeEgenskaper";
import Luke01 from "./Luke01";
import Luke02 from "./Luke02";
import Luke03 from "./Luke03";
import Luke04 from "./Luke04";
import Luke05 from "./Luke05";
import Luke06 from "./Luke06";
import Luke07 from "./Luke07";
import Luke08 from "./Luke08";
import Luke09 from "./Luke09";
import Luke10 from "./Luke10";

const luker: ILukeEgenskaper[] = [
  { dag: 1, innhold: <Luke01/>, kategori: "stor" },
  { dag: 2, innhold: <Luke02/>, kategori: "medium" },
  { dag: 3, innhold: <Luke03/>, kategori: "liten" },
  { dag: 4, innhold: <Luke04/>, kategori: "stor" },
  { dag: 5, innhold: <Luke05/>, kategori: "medium" },
  { dag: 6, innhold: <Luke06/>, kategori: "liten" },
  { dag: 7, innhold: <Luke07/>, kategori: "medium" },
  { dag: 8, innhold: <Luke08/>, kategori: "stor" },
  { dag: 9, innhold: <Luke09/>, kategori: "medium" },
  { dag: 10, innhold: <Luke10/>, kategori: "medium" },
  { dag: 11, innhold: "", kategori: "medium" },
  { dag: 12, innhold: "", kategori: "lucia" },
  { dag: 13, innhold: "", kategori: "liten" },
  { dag: 14, innhold: "", kategori: "stor" },
  { dag: 15, innhold: "", kategori: "medium" },
  { dag: 16, innhold: "", kategori: "stor" },
  { dag: 17, innhold: "", kategori: "liten" },
  { dag: 18, innhold: "", kategori: "stor" },
  { dag: 19, innhold: "", kategori: "medium" },
  { dag: 20, innhold: "", kategori: "liten" },
  { dag: 21, innhold: "", kategori: "medium" },
  { dag: 22, innhold: "", kategori: "stor" },
  { dag: 23, innhold: "", kategori: "liten" },
  { dag: 24, innhold: "", kategori: "julaften" }
]

export default function Kalender(){
  return(
    <div className = "grid grid-flow-dense grid-cols-4 md:grid-cols-6 auto-rows-[5rem] gap-2">
      {luker.map((luke) => (
        <Luke
          key={luke.dag}
          dag={luke.dag}
          innhold={luke.innhold}
          kategori={luke.kategori}
        />
      ))}
    </div>
  );
}