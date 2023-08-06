export const Role = {
  USER: "USER",
  COMPANY: "COMPANY",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export const Degree = {
  DTEK: "DTEK",
  DSIK: "DSIK",
  DVIT: "DVIT",
  BINF: "BINF",
  IMO: "IMO",
  INF: "INF",
  PROG: "PROG",
  DSC: "DSC",
  ARMNINF: "ARMNINF",
  POST: "POST",
  MISC: "MISC",
} as const;
export type Degree = (typeof Degree)[keyof typeof Degree];
export const Group = {
  MAKERSPACE: "MAKERSPACE",
  BOARD: "BOARD",
  TILDE: "TILDE",
  GNIST: "GNIST",
  BEDKOM: "BEDKOM",
  ESC: "ESC",
  HYGGKOM: "HYGGKOM",
  WEBKOM: "WEBKOM",
  PROGBAR: "PROGBAR",
  SQUASH: "SQUASH",
} as const;
export type Group = (typeof Group)[keyof typeof Group];
export const HappeningType = {
  BEDPRES: "BEDPRES",
  EVENT: "EVENT",
} as const;
export type HappeningType = (typeof HappeningType)[keyof typeof HappeningType];
export const RegistrationStatus = {
  REGISTERED: "REGISTERED",
  WAITLISTED: "WAITLISTED",
  DEREGISTERED: "DEREGISTERED",
} as const;
export type RegistrationStatus = (typeof RegistrationStatus)[keyof typeof RegistrationStatus];
export const QuestionType = {
  TEXT: "TEXT",
  CHOICE: "CHOICE",
} as const;
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];
