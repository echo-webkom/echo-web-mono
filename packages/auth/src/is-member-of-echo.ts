const FEIDE_GROUPS_ENDPOINT = "https://groups-api.dataporten.no";

type GroupsResponse = {
  id: string;
  type: string;
  displayName: string;
  membership: {
    basic: string;
    active: boolean;
    displayName: string;
  };
  parent: string;
};

const PROGRAM_ID_PREFIX = "fc:fs:fs:prg:uib.no:";

const VALID_PROGRAM_IDS = [
  "BAMN-DTEK",
  "BAMN-DSIK",
  "BAMN-DVIT",
  "BAMN-BINF",
  "BATF-IMØ",
  "MAMN-INF",
  "MAMN-PROG",
  "ÅRMN-INF",
  "5MAMN-DSC",
  "POST",
];

export async function isMemberOfecho(accessToken: string) {
  try {
    const response = await fetch(`${FEIDE_GROUPS_ENDPOINT}/groups/me/groups`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status > 200) {
      return "Ikke gyldig bruker.";
    }

    const groups = (await response.json()) as Array<GroupsResponse>;
    const userPrograms = groups.filter((group) => group.id.startsWith(PROGRAM_ID_PREFIX));
    const isMemberOfecho = userPrograms.some((program) =>
      VALID_PROGRAM_IDS.includes(program.id.slice(PROGRAM_ID_PREFIX.length)),
    );

    if (!isMemberOfecho) {
      return "Du er ikke regnet som medlem av echo. Kontakt Webkom hvis du mener dette er feil.";
    }

    return true;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return "Ugyldig token.";
    }

    if (error instanceof TypeError) {
      return "Noe gikk galt.";
    }

    return "Noe gikk galt.";
  }
}
