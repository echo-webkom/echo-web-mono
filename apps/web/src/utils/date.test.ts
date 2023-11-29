import { describe, expect, it } from "vitest";

import { norwegianDateString, shortDate, shortDateNoTime } from "./date";

describe("dates", () => {
  it("should format dates", () => {
    const date = new Date("2002-12-17");

    const norwegianDateStringResp = norwegianDateString(date);
    const shortDateResp = shortDate(date);
    const shortDateNoTimeResp = shortDateNoTime(date);

    expect(norwegianDateStringResp).toMatchInlineSnapshot(`"Tirsdag 17. desember 2002 kl. 01:00"`);
    expect(shortDateResp).toMatchInlineSnapshot(`"17. des. 2002, 01:00"`);
    expect(shortDateNoTimeResp).toMatchInlineSnapshot(`"17. des. 2002"`);
  });
});
