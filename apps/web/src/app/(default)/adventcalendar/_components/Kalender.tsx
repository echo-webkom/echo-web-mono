import { Luke } from "./ILukeEgenskaper";
import type { ILukeEgenskaper } from "./ILukeEgenskaper";


const luker: ILukeEgenskaper[] = [
  { dag: 1, 
    innhold: "", 
    kategori: "stor" },
  { dag: 2, innhold: "", kategori: "medium" },
  { dag: 3, innhold: "", kategori: "liten" },
  { dag: 4, innhold: "", kategori: "stor" },
  { dag: 5, innhold: "", kategori: "medium" },
  { dag: 6, innhold: "", kategori: "liten" },
  { dag: 7, innhold: "", kategori: "medium" },
  { dag: 8, innhold: "", kategori: "stor" },
  { dag: 9, innhold: "", kategori: "medium" },
  { dag: 10, innhold: "", kategori: "medium" },
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