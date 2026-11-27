"use client"; 
/*hele filen kjøres som delfault på server, fordi det er react.
  men vi vil at hele filen kjøres på nettsiden, slik at den kan
  oppdatere seg. use client må stå før import. kunne stått i de 
  andrer filene, men vi vil ha den bare der det er nødvendig*/

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type Kategori = "liten" | "medium" | "stor" | "lucia" | "julaften";

const kategoriStil: Record<Kategori, String> = { 
  "liten": "col-span row-span  border-1 ", //stilen på type A
  "medium": "col-span-1 row-span-2 border-1 ", // stil på type B
  "stor": "col-span-2 row-span-2 border-1 ", // stil på type C
  "lucia": "col-span-2 row-span-2 border-1 ", // strl stor
  "julaften": "col-span-2 row-span-2 border-1 " // strl stor
};



export interface ILukeEgenskaper {
  dag: number; 
  innhold: ReactNode;
  kategori: Kategori;
}


export function Luke({ dag, innhold, kategori}: ILukeEgenskaper){
  const [erÅpnet, setErÅpnet] = useState(false);

  function håndterKlikk() {
    
    let dato = true; //let dato: boolean = true men typeskript sjønner typen

    if (dato){
      setErÅpnet(true);
    }
    else{
      //liten melding om å vente
    }

  }

  function lukk(){
    setErÅpnet(false);
  }

  useEffect(() => {
    if (!erÅpnet) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [erÅpnet]);

  return(
    <> 
      <button 
        onClick={håndterKlikk}
        className={`rounded p-2 text-white ${kategoriStil[kategori]}`}> 
          {dag}
      </button>
      {erÅpnet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-[#fdf6f6] text-[#8e613c]">
            <button onClick={lukk} className="absolute top-3 p right-3 text-2l">
              ×
            </button> 
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-3 pb-4 ">
              <h2 className="mb-1 text-center bg-[#fdf6f6] text-[#8e613c]">
                {dag}. desember
              </h2>
              {innhold}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

