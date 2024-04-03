import { describe, expect, it } from "vitest";

import { type RegistrationWithUser } from "@/components/registration-table";
import { getRegistrationStatus } from "../registrations";

export type TRegistration = Omit<
  RegistrationWithUser,
  "userId" | "happeningId" | "unregisterReason" | "answers" | "user" | "changedBy"
> & {
  status: "registered" | "unregistered" | "removed" | "waiting" | "pending";
  prevStatus: "registered" | "unregistered" | "removed" | "waiting" | "pending" | null;
  changedAt: Date | null;
  createdAt: Date;
};

const registration1: TRegistration = {
  status: "registered",
  prevStatus: "waiting",
  changedAt: new Date("2002-12-17T01:00"),
  createdAt: new Date("2002-12-16T16:00"),
};
const registration2: TRegistration = {
  status: "registered",
  prevStatus: null,
  changedAt: null,
  createdAt: new Date("2002-12-16T16:00"),
};
const registration3: TRegistration = {
  status: "registered",
  prevStatus: null,
  changedAt: null,
  createdAt: new Date("2002-12-14T16:00"),
};
const registration4: TRegistration = {
  status: "unregistered",
  prevStatus: "waiting",
  changedAt: new Date("2002-12-17T01:00"),
  createdAt: new Date("2002-12-16T16:00"),
};
const registration5: TRegistration = {
  status: "unregistered",
  prevStatus: "waiting",
  changedAt: new Date("2002-12-16T01:00"),
  createdAt: new Date("2002-12-15T16:00"),
};

const registration6: TRegistration = {
  status: "registered",
  prevStatus: null,
  changedAt: null,
  createdAt: new Date("2002-12-14T16:00"),
};
const registration7: TRegistration = {
  status: "waiting",
  prevStatus: null,
  changedAt: null,
  createdAt: new Date("2002-12-14T16:00"),
};
const happeningDate = new Date("2002-12-17T11:00");

describe("should format registration status", () => {
  it("too late registration, from waitinglist", () => {
    const str = getRegistrationStatus(registration1, happeningDate);
    expect(str).toBe("Påmeldt fra venteliste 10 t før");
  });

  it("too late registration", () => {
    const str = getRegistrationStatus(registration2, happeningDate);
    expect(str).toBe("Påmeldt 19 t før");
  });

  it("registration in time", () => {
    const str = getRegistrationStatus(registration3, happeningDate);
    expect(str).toBe("Påmeldt");
  });

  it("deregistration from waitinglist, under 24 h before", () => {
    const str = getRegistrationStatus(registration4, happeningDate);
    expect(str).toBe("Avmeldt fra venteliste 10 t før");
  });

  it("deregistration from waitinglist", () => {
    const str = getRegistrationStatus(registration5, happeningDate);
    expect(str).toBe("Avmeldt fra venteliste");
  });

  it("registration in time, no previous status", () => {
    const str = getRegistrationStatus(registration6, happeningDate);
    expect(str).toBe("Påmeldt");
  });
  it("waiting list in time, no previous status", () => {
    const str = getRegistrationStatus(registration7, happeningDate);
    expect(str).toBe("Venteliste");
  });
});
