import type { ReactNode } from "react";
import { useState } from "react";

type Kategori = "liten" | "medium" | "stor" | "lucia" | "julaften";

const kategoriStil: Record<Kategori, String> = { 
  "liten": " ", //stilen på type A
  "medium": " ", // stil på type B
  "stor": " ", // stil på type C
  "lucia": "", // strl stor
  "julaften": "" // strl stor
};

interface ILukeEgenskaper {
  dag: number; 
  innhold: ReactNode;
  kategori: Kategori;
}


function Luke({ dag, innhold}: ILukeEgenskaper){
  const [erÅpnet, setErÅpnet] = useState(false);

  function håndterKlikk() {
    setErÅpnet(true);
  }

  return(
    <button 
      onClick={håndterKlikk}
      className={"rounded p-2 text-white ${kategoriStil[kategori]}"}
    > 
      {erÅpnet ? innhold : dag}
      </button>
  );
}

export default Luke;