import { pgEnum } from "drizzle-orm/pg-core";

export type DegreeType = (typeof degreeTypeEnum)["enumValues"][number];
export const degreeTypeEnum = pgEnum("degree_type", ["bachelors", "masters", "integrated", "year"]);

export type HappeningType = (typeof happeningTypeEnum)["enumValues"][number];
export const happeningTypeEnum = pgEnum("happening_type", ["bedpres", "event", "external"]);

export type RegistrationStatus = (typeof registrationStatusEnum)["enumValues"][number];
export const registrationStatusEnum = pgEnum("registration_status", [
  "registered",
  "unregistered",
  "removed",
  "waiting",
  "pending",
]);

export type QuestionType = (typeof questionTypeEnum)["enumValues"][number];
export const questionTypeEnum = pgEnum("question_type", ["text", "textarea", "radio", "checkbox"]);

export type UserType = (typeof userTypeEnum)["enumValues"][number];
export const userTypeEnum = pgEnum("user_type", ["student", "company", "guest", "alum"]);

export type FeedbackCategory = (typeof feedbackCategoryEnum)["enumValues"][number];
export const feedbackCategoryEnum = pgEnum("feedback_category", [
  "bug",
  "feature",
  "login",
  "other",
]);
