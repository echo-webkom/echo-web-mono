"use server";

import { and, eq } from "drizzle-orm";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { accounts, users } from "@echo-webkom/db/schemas";

import { isValidVerified } from "@/lib/is-valid-verified";

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

export async function verifyFeide() {
  try {
    const user = await getAuth();

    if (!user) {
      return {
        success: false,
        message: "Du må være logget inn.",
      };
    }

    if (isValidVerified(user.verifiedAt)) {
      return {
        success: true,
        message: "Du er medlem av echo",
      };
    }

    const account = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.provider, "feide"), eq(accounts.userId, user.id)))
      .then((res) => res[0] ?? null);

    if (!account) {
      return {
        success: false,
        message: "Du må være logget inn med Feide",
      };
    }

    const response = await fetch(`${FEIDE_GROUPS_ENDPOINT}/groups/me/groups`, {
      headers: {
        Authorization: `Bearer ${account.access_token}`,
      },
    });

    if (response.status > 200) {
      throw new Error("Noe gikk galt.");
    }

    const groups = (await response.json()) as Array<GroupsResponse>;
    const userPrograms = groups.filter((group) => group.id.startsWith(PROGRAM_ID_PREFIX));
    const isMemberOfecho = userPrograms.some((program) =>
      VALID_PROGRAM_IDS.includes(program.id.slice(PROGRAM_ID_PREFIX.length)),
    );

    if (!isMemberOfecho) {
      return {
        success: false,
        message:
          "Du er ikke regnet som medlem av echo. Kontakt Webkom hvis du mener dette er feil.",
      };
    }

    const updatedUser = await db
      .update(users)
      .set({
        verifiedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning()
      .then((res) => res[0] ?? null);

    if (!updatedUser) {
      return {
        success: false,
        message: "Du er medlem, men vi klarte ikke å oppdatere brukeren din. Kontakt Webkom nå!",
      };
    }

    return {
      success: true,
      message: "Du er medlem av echo",
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        message: "Noe gikk galt. (id: 1)",
      };
    }

    if (error instanceof TypeError) {
      return {
        success: false,
        message: "Noe gikk galt. (id: 2)",
      };
    }

    return {
      success: false,
      message: "Noe gikk galt.",
    };
  }
}
