import {type Year} from "@echo-webkom/db/types";

export const degreeToString = {
  bachelor: {
    DTEK: "Datateknologi",
    DSIK: "Datasikkerhet",
    DVIT: "Datavitenskap",
    IMO: "Informatikk-matematikk-økonomi",
    BINF: "Bioinformatikk",
  },
  master: {
    DSC: "Master i datascience",
    INF: "Master i informatikk",
    PROG: "Programvareutvikling",
  },
  misc: {
    MISC: "Annet",
    POST: "Post-bachelor",
    ARMNINF: "Årstudium i informatikk",
  },
};

export const yearToString: Record<Year, string> = {
  FIRST: "1. året",
  SECOND: "2. året",
  THIRD: "3. året",
  FOURTH: "4. året",
  FIFTH: "5. året",
};
