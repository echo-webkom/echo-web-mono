"use server";

import { kaffeApi } from "@/api/kaffe";
import { groupActionClient } from "@/lib/safe-action";

export const addKaffeReportAction = groupActionClient(["webkom", "hovedstyret"])
  .metadata({ actionName: "addKaffeReport" })
  .action(async ({ ctx }) => {
    return await kaffeApi.strike(ctx.user.id);
  });

export const resetKaffeStrikesAction = groupActionClient(["webkom", "hovedstyret"])
  .metadata({ actionName: "resetKaffeStrikes" })
  .action(async () => {
    return await kaffeApi.reset();
  });
