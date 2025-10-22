import { z } from "zod";

export const StrikeType = {
  DeregisterBeforeDeadline: "deregister-before-deadline",
  DeregisterAfterDeadline: "deregister-after-deadline",
  WrongInformation: "wrong-information",
  LateArrival: "late-arrival",
  NoFeedback: "no-feedback",
  NoShow: "no-show",
  Other: "other",
};

export type StrikeType = (typeof StrikeType)[keyof typeof StrikeType];

export const StrikeTypeLabels = {
  [StrikeType.DeregisterBeforeDeadline]: "Avmelding før frist",
  [StrikeType.DeregisterAfterDeadline]: "Avmelding etter frist",
  [StrikeType.WrongInformation]: "Oppgitt feil informasjon",
  [StrikeType.LateArrival]: "Kommet for sent",
  [StrikeType.NoFeedback]: "Ikke svart på tilbakemeldings skjema",
  [StrikeType.NoShow]: "Ikke møtt (ikke gitt beskjed)",
  [StrikeType.Other]: "Annet",
};

export const StrikeTypeCount = {
  [StrikeType.DeregisterBeforeDeadline]: 1,
  [StrikeType.DeregisterAfterDeadline]: 2,
  [StrikeType.WrongInformation]: 1,
  [StrikeType.LateArrival]: 1,
  [StrikeType.NoFeedback]: 1,
  [StrikeType.NoShow]: 7,
};

export const addStrikesSchema = z
  .object({
    userId: z.string().min(1),
    strikeType: z.enum(StrikeType),
    reason: z.string(),
    count: z.coerce.number<number>().min(1).max(5),
    strikeExpiresInMonths: z.coerce.number<number>().min(1).max(12),
    banExpiresInMonths: z.coerce.number<number>().min(1).max(12),
  })
  .superRefine((data, ctx) => {
    if (data.strikeType === StrikeType.Other && !data.reason) {
      return ctx.addIssue({
        code: "custom",
        message: "Må oppgi en grunn for prikken",
      });
    }
  });

export const parseAddStrikesSchema = (
  input: z.infer<typeof addStrikesSchema>,
):
  | {
      success: true;
      message?: undefined;
      data: Omit<z.infer<typeof addStrikesSchema>, "strikeType">;
    }
  | {
      success: false;
      data?: undefined;
      message: string;
    } => {
  const { success, data } = addStrikesSchema.safeParse(input);

  if (!success) {
    return {
      success: false,
      message: "Ugyldig input",
    };
  }

  if (input.strikeType === StrikeType.Other) {
    return {
      success: true,
      data: {
        count: data.count,
        strikeExpiresInMonths: data.strikeExpiresInMonths,
        banExpiresInMonths: data.banExpiresInMonths,
        reason: data.reason,
        userId: data.userId,
      },
    };
  }

  return {
    success: true,
    data: {
      count: StrikeTypeCount[input.strikeType] ?? 1,
      strikeExpiresInMonths: data.strikeExpiresInMonths,
      banExpiresInMonths: data.banExpiresInMonths,
      userId: data.userId,
      reason: StrikeTypeLabels[input.strikeType] ?? "Ingen grunn oppgitt",
    },
  };
};
