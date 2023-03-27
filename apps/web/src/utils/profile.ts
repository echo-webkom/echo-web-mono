import {type Degree, type Year} from "@echo-webkom/db";

export const degreeToString: Record<Degree, string> = {
  DTEK: "Datateknologi",
  DSIK: "Datasikkerhet",
  DVIT: "Datavitenskap",
  IMO: "Informatikk-matematikk-økonomi",
  BINF: "Bioinformatikk",
  ARMNINF: "Årstudium i informatikk",
  DSC: "Master i datascience",
  INF: "Master i informatikk",
  POST: "Post-bachelor",
  MISC: "Annet",
  PROG: "Programvareutvikling",
};

export const yearToString: Record<Year, string> = {
  FIRST: "1. året",
  SECOND: "2. året",
  THIRD: "3. året",
  FOURTH: "4. året",
  FIFTH: "5. året",
};
