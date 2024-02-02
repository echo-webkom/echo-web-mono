export const degreeTypeEnum = ["bachelors", "masters", "integrated", "year"] as const;
export type DegreeType = (typeof degreeTypeEnum)[number];

export const happeningTypeEnum = ["bedpres", "event", "external"] as const;
export type HappeningType = (typeof happeningTypeEnum)[number];

export const registrationStatusEnum = [
  "registered",
  "unregistered",
  "removed",
  "waiting",
  "pending",
] as const;
export type RegistrationStatus = (typeof registrationStatusEnum)[number];

export const questionTypeEnum = ["text", "textarea", "radio", "checkbox"] as const;
export type QuestionType = (typeof questionTypeEnum)[number];

export const userTypeEnum = ["student", "company", "guest", "alum"] as const;
export type UserType = (typeof userTypeEnum)[number];

export const feedbackCategoryEnum = ["bug", "feature", "login", "other"] as const;
export type FeedbackCategory = (typeof feedbackCategoryEnum)[number];
