import { addDays } from "date-fns";
import { describe, expect, it } from "vitest";

import { type RegistrationStatus } from "@echo-webkom/db/schemas";

import { getSpotRangeInfo } from "../spot-range-info";

const TODAY = new Date();
const TOMORROW = addDays(TODAY, 1).toISOString();
const YESTERDAY = addDays(TODAY, -1).toISOString();

describe("getSpotRangeInfo", () => {
  it("should return displays spots", () => {
    const happening = { registrationStart: TOMORROW };
    const spotRanges = [{ spots: 60 }];
    const registrations = [
      { status: "registered" },
      { status: "registered" },
      { status: "waiting" },
    ] satisfies Array<{ status: RegistrationStatus }>;

    expect(getSpotRangeInfo(happening, spotRanges, registrations)).toBe("60 plasser");
  });

  it("should return 'Fullt' when full", () => {
    const happening = { registrationStart: YESTERDAY };
    const spotRanges = [{ spots: 3 }];
    const registrations = [
      { status: "registered" },
      { status: "registered" },
      { status: "registered" },
    ] satisfies Array<{ status: RegistrationStatus }>;

    expect(getSpotRangeInfo(happening, spotRanges, registrations)).toBe("Fullt");
  });

  it("should display nothing", () => {
    const happening = { registrationStart: TOMORROW };
    const spotRanges: Array<never> = [];
    const registrations = [] satisfies Array<{ status: RegistrationStatus }>;

    expect(getSpotRangeInfo(happening, spotRanges, registrations)).toBe(null);
  });

  it("should display '∞' when max capacity is 0", () => {
    const happening = { registrationStart: YESTERDAY };
    const spotRanges = [{ spots: 0 }];
    const registrations = [
      {
        status: "registered",
      },
    ] satisfies Array<{ status: RegistrationStatus }>;

    expect(getSpotRangeInfo(happening, spotRanges, registrations)).toBe("1/∞");
  });
});
