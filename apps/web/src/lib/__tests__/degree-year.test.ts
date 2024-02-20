import { describe, expect, it } from "vitest";

import { degreeYearText } from "../degree-year-text";

describe("degreeYearText", () => {
  it("should return 1 - 3", () => {
    expect(degreeYearText([1, 2, 3])).toBe("1 - 3. trinn");
    expect(degreeYearText([1, 2])).toBe("1 - 2. trinn");
    expect(degreeYearText([1, 2, 3, 4, 5])).toBe("alle");
    expect(degreeYearText([1, 2, 4, 5])).toBe("1 - 2 og 4 - 5. trinn");
    expect(degreeYearText([1])).toBe("1. trinn");
    expect(degreeYearText([])).toBe("ingen");
    expect(degreeYearText([1, 3, 5])).toBe("1, 3 og 5. trinn");
  });
});
