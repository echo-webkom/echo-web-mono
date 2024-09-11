import { addDays } from "date-fns";
import { describe, expect, it } from "vitest";

import { getSpotRangeInfo } from "../spot-range-info";

const TODAY = new Date();
const TOMORROW = addDays(TODAY, 1).toISOString();
const YESTERDAY = addDays(TODAY, -1).toISOString();

describe("getSpotRangeInfo", () => {
  it("should return displays spots", () => {
    expect(
      getSpotRangeInfo({
        registrationStart: TOMORROW,
        waiting: 0,
        registered: 0,
        max: 60,
      }),
    ).toBe("60 plasser");
  });

  it("should return 'Fullt' when full", () => {
    expect(
      getSpotRangeInfo({
        registrationStart: YESTERDAY,
        registered: 3,
        waiting: 0,
        max: 3,
      }),
    ).toBe("Fullt");
  });

  it("should display nothing", () => {
    expect(
      getSpotRangeInfo({ registrationStart: TOMORROW, waiting: 0, registered: 0, max: null }),
    ).toBe(null);
  });

  it("should display '∞' when max capacity is 0", () => {
    expect(
      getSpotRangeInfo({ registrationStart: YESTERDAY, registered: 1, waiting: 0, max: 0 }),
    ).toBe("1/∞");
  });
});
