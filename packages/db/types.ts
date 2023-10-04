import type { ColumnType } from "kysely";

import type { Degree, Group, HappeningType, QuestionType, RegistrationStatus, Role } from "./enums";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
};
export type Answer = {
  id: string;
  questionId: string;
  registrationId: string;
  text: string | null;
  choice: string | null;
};
export type Happening = {
  slug: string;
  type: HappeningType;
  date: Timestamp | null;
  title: string;
  registrationStart: Timestamp | null;
  registrationEnd: Timestamp | null;
  groups: Group[];
};
export type Question = {
  id: string;
  title: string;
  required: boolean;
  type: QuestionType;
  options: string[];
  happeningSlug: string | null;
};
export type Registration = {
  id: string;
  userId: string;
  happeningSlug: string;
  status: RegistrationStatus;
  reason: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
};
export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Timestamp;
};
export type SiteFeedback = {
  id: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  name: string | null;
  email: string | null;
  message: string;
  isRead: Generated<boolean>;
};
export type SpotRange = {
  id: string;
  minDegreeYear: number;
  maxDegreeYear: number;
  spots: number;
  happeningSlug: string | null;
};
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Timestamp | null;
  image: string | null;
  alternativeEmail: string | null;
  role: Generated<Role>;
  degree: Degree | null;
  year: number | null;
  studentGroups: Group[];
};
export type VerificationToken = {
  identifier: string;
  token: string;
  expires: Timestamp;
};
export type DB = {
  Account: Account;
  Answer: Answer;
  Happening: Happening;
  Question: Question;
  Registration: Registration;
  Session: Session;
  SiteFeedback: SiteFeedback;
  SpotRange: SpotRange;
  User: User;
  VerificationToken: VerificationToken;
};
