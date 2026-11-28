
"use client";
import { useState } from "react";

export interface Sporsmaal {
    tekst: string;
    alternativer: string[];
    riktig: number;
}

interface JulequizProps{
    sporsmaal: Sporsmaal[];
}

function Julequiz({sporsmaal}: JulequizProps){
    const [indeks, setIndeks] = useState(0);
    const [valgt, setValgt] = useState<number | null>(null);
    const [poeng, setPoeng] = useState(0);

    const gjeldende = sporsmaal[indeks];

    if (!gjeldende) {
        return (
            <div className="text-center">
                <p className="text-xl font-bold">Fullført!</p>
                <p> 
                    Du fikk {poeng} av {sporsmaal.length} riktige.
                </p>
            </div>
        );
    }

    const harSvart = valgt !== null;
    const erSiste = indeks === sporsmaal.length - 1;

    const velg = (i: number) => {
    if (harSvart) return;
    setValgt(i);
    if (i === gjeldende.riktig) setPoeng((p)=> p+1);
}

    const neste = () => {
    setIndeks((i) => i + 1);
    setValgt(null);
}

    const svarFarge = (i: number): string => {
    if (!harSvart) return "bg-[#fdf6f6] text-[#8e613c]"; 
    if (i === gjeldende.riktig) return "bg-green-600 text-white";
    if (i === valgt) return "bg-red-600 text-white";
    return "bg-[#fdf6f6] text-gray-500";
};

    return (
        <div className="flex flex-col gap-3">
            <p className="text-sm">
                Spørsmål {indeks + 1} av {sporsmaal.length}
            </p>
            <p className="font-bold">{gjeldende.tekst}</p>
            
            {gjeldende.alternativer.map((alt, i)=> (
                <button
                key={alt}
                onClick={() => velg(i)}
                disabled={harSvart}
                className={`rounded p-2 text-left ${svarFarge(i)}`}
                >
                    {harSvart && i === gjeldende.riktig && "✓ "}
                    {harSvart && i === valgt && i !== gjeldende.riktig && "✗ "}
                    {alt}
                </button>
            ))}

            {harSvart && (
                <button onClick={neste} className="rounded bg-[#fdf6f6] p-2 text-[#8e613c]">
                    {erSiste ? "Se resultat" : "Neste"}
                </button>
            )}
        </div>
    );
}

export default Julequiz;