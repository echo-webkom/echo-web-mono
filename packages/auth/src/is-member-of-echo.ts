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

export const SignInError = {
  NOT_MEMBER_OF_ECHO: "NOT_MEMBER_OF_ECHO",
  INVALID_TOKEN: "INVALID_TOKEN",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export const isValidSignInError = (error: string): error is keyof typeof SignInError =>
  Object.keys(SignInError).includes(error);

export async function isMemberOfecho(accessToken: string) {
  try {
    const response = await fetch(`${FEIDE_GROUPS_ENDPOINT}/groups/me/groups`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status > 200) {
      return SignInError.INVALID_TOKEN;
    }

    const groups = (await response.json()) as Array<GroupsResponse>;

    const userPrograms = groups.filter((group) => group.id.startsWith(PROGRAM_ID_PREFIX));

    const isMemberOfecho = userPrograms.some((program) =>
      VALID_PROGRAM_IDS.includes(program.id.slice(PROGRAM_ID_PREFIX.length)),
    );

    if (!isMemberOfecho) {
      return SignInError.NOT_MEMBER_OF_ECHO;
    }

    return true;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return SignInError.INVALID_TOKEN;
    }

    return SignInError.INTERNAL_ERROR;
  }
}
