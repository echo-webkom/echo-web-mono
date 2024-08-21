import { beforeEach } from "node:test";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  isBetween,
  norwegianDateString,
  shortDate,
  shortDateNoTime,
  shortDateNoYear,
  time,
  toDateOrNull,
} from "../date";

describe("dates", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("should format to norwegian date string", () => {
    const date = new Date("2002-12-17");
    const str = norwegianDateString(date);
    expect(str).toBe("Tirsdag 17. desember 2002 kl. 01:00");
  });

  it("should format to short date string", () => {
    const date = new Date("2002-12-17");
    const str = shortDate(date);
    expect(str).toBe("17. des. 2002, 01:00");
  });

  it("should format to short date string without time", () => {
    const date = new Date("2002-12-17");
    const str = shortDateNoTime(date);
    expect(str).toBe("17. des. 2002");
  });

  it("should format the date to short date without year", () => {
    const date = new Date("2002-12-17");
    const str = shortDateNoYear(date);
    expect(str).toBe("17. desember kl. 01:00");
  });

  it("should format to time string", () => {
    const date = new Date("2002-12-17T18:32");
    const str = time(date);
    expect(str).toBe("18:32");
  });

  it("should convert to date", () => {
    const date = toDateOrNull("2002-12-17T18:32");
    expect(date).toBeInstanceOf(Date);
  });

  it("should return null if invalid date", () => {
    const date = toDateOrNull("invalid date");
    expect(date).toBeNull();
  });

  it("should be between two dates", () => {
    const startDate = new Date("2002-12-17");
    const endDate = new Date("2002-12-19");

    vi.setSystemTime(new Date("2002-12-18"));

    expect(isBetween(startDate, endDate)).toBe(true);
  });

  it("should not be between two dates", () => {
    const startDate = new Date("2002-12-17");
    const endDate = new Date("2002-12-19");

    vi.setSystemTime(new Date("2002-12-20"));

    expect(isBetween(startDate, endDate)).toBe(false);
  });

  it("should not be between two dates", () => {
    const startDate = new Date("2002-12-17T18:32");
    const endDate = new Date("2002-12-19T18:32");

    vi.setSystemTime(new Date("2002-12-19T18:33"));

    expect(isBetween(startDate, endDate)).toBe(false);
  });
});
