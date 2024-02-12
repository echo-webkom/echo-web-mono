import {degreeYearText} from "../degree-year-text"

import { describe, it, expect } from "vitest"


describe("degreeYearText", () => {
    it("should return 1 - 3", () => {
        expect(degreeYearText([1, 2, 3])).toBe("1 - 3")
        expect(degreeYearText([1, 2])).toBe("1 - 2")
        expect(degreeYearText([1, 2, 3, 4, 5])).toBe("1 - 5")
        expect(degreeYearText([1, 2, 4, 5])).toBe("1 - 2 og 4 - 5")
        expect(degreeYearText([1])).toBe("1")
        expect(degreeYearText([])).toBe("alle")


    })
})