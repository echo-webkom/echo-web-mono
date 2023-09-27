import { prisma, type SiteFeedback } from "@echo-webkom/db";

import { type Result } from "./utils";

export async function getAllFeedback(): Promise<Result<Array<SiteFeedback>>> {
  try {
    const data = await prisma.siteFeedback.findMany();

    return {
      data,
    };
  } catch {
    return {
      error: "Failed to get feedback",
    };
  }
}
