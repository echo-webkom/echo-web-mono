import { SignInError, type ISignInError } from "./error";

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
const ORG_UNIT_ID_PREFIX = "fc:org:uib.no:unit:";

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

const VALID_UNIT_IDS = [
  "121200", // NT-II
];

export type IsMemberOfechoFn = (accessToken: string) => Promise<
  | {
      success: true;
      error: undefined;
    }
  | {
      success: false;
      error: ISignInError;
    }
>;

export const isMemberOfecho: IsMemberOfechoFn = async (accessToken: string) => {
  try {
    const response = await fetch(`${FEIDE_GROUPS_ENDPOINT}/groups/me/groups`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: SignInError.INTERNAL_ERROR,
      };
    }

    const groups = (await response.json()) as Array<GroupsResponse>;

    const userOrgUnits = groups.filter((group) => group.id.startsWith(ORG_UNIT_ID_PREFIX));

    const isMemberOfAllowedOrgUnits = userOrgUnits.some((orgUnit) =>
      VALID_UNIT_IDS.includes(orgUnit.id.slice(ORG_UNIT_ID_PREFIX.length)),
    );

    const userPrograms = groups.filter((group) => group.id.startsWith(PROGRAM_ID_PREFIX));

    const isMemberOfAllowedPrograms = userPrograms.some((program) =>
      VALID_PROGRAM_IDS.includes(program.id.slice(PROGRAM_ID_PREFIX.length)),
    );

    if (!isMemberOfAllowedPrograms && !isMemberOfAllowedOrgUnits) {
      return {
        success: false,
        error: SignInError.NOT_MEMBER_OF_ECHO,
      };
    }

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: SignInError.INTERNAL_ERROR,
    };
  }
};
