import { pgEnum } from "drizzle-orm/pg-core";

export type AccountType = (typeof accountTypeEnum.enumValues)[number];
export type Degree = (typeof degreeEnum.enumValues)[number];
export type Year = (typeof yearEnum.enumValues)[number];
export type Group = (typeof groupEnum.enumValues)[number];
export type HappeningType = (typeof happeningTypeEnum.enumValues)[number];
export type RegistrationStatus = (typeof registrationStatusEnum.enumValues)[number];
export type QuestionType = (typeof questionTypeEnum.enumValues)[number];

export const accountTypeEnum = pgEnum("user_role", ["admin", "student", "company", "guest"]);

export const degreeEnum = pgEnum("degree", [
  "dtek",
  "dsik",
  "dvit",
  "binf",
  "imo",
  "inf",
  "prog",
  "dsc",
  "armninf",
  "post",
  "misc",
]);

export const yearEnum = pgEnum("year", ["first", "second", "third", "fourth", "fifth"]);

export const groupEnum = pgEnum("group", [
  "makerspace",
  "board",
  "tilde",
  "gnist",
  "bedkom",
  "esc",
  "hyggkom",
  "webkom",
  "progbar",
  "squash",
]);

export const happeningTypeEnum = pgEnum("happening_type", ["bedpres", "event"]);

export const registrationStatusEnum = pgEnum("registration_status", [
  "registered",
  "unregistered",
  "waiting",
  "removed",
]);

export const questionTypeEnum = pgEnum("question_type", [
  "text",
  "textarea",
  "checkbox",
  "radio",
  "select",
]);

export const siteFeedbackTypeEnum = pgEnum("site_feedback_type", ["bug", "feature", "other"]);
