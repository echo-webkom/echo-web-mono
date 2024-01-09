import { describe, expect, it } from "vitest";

import { initials } from "./initials";

describe("initials", () => {
  it("should get initials", () => {
    expect(initials("Programmerbar")).toBe("PR");
    expect(initials("Webkom")).toBe("WE");
    expect(initials("webkom")).toBe("WE");
    expect(initials("Bo Salhus")).toBe("BS");
    expect(initials("b")).toBe("B");
    expect(initials("")).toBe("");
    expect(initials(" ")).toBe("");
    expect(initials("Programmerbar 🍸")).toBe("");
  });
});
