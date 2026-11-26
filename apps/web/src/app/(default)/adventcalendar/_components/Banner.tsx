
interface BannerProps {
  dato?: Date;
}

//ikkje skriv "husk å åpne dagens luke" på slutten, det er allerede med senere
const dagsmeldinger: Record<number, string> = {
  1: "Velkommen!! Årets første luke er klar til å åpnes. Husk å møte opp til Hyggkom sin fysiske julekalender i programmerbar kl 1200 idag!",
  2: "", 
  3: "",
  4: "",
  5: "",
  6: "",
  7: "",
  8: "",
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: "",
  15: "",
  16: "",
}

function hentMelding(dato: Date): string {
  const måned = dato.getMonth();
  const dag = dato.getDate();

  if(måned<11) return "OBS! Du er litt tidlig ute, kalenderen åpner 1.desember!";
  if(dag>17) return "Hyggkom sin julekalender er ferdig for i år, men husk å åpne lukende under!";
  return dagsmeldinger[dag] ?? "Husk å åpne dagens luke!";

}

export function Banner({ dato = new Date() }: BannerProps){
  return(
    <header className="bg-[#a84d45] p-4 font-semibold text-white" >
      {hentMelding(dato)}
    </header>
  );
}