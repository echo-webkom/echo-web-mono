/**
 * This file defines all the relations between the different tables.
 * It is in a seperate file to avoid circular dependencies between the schema files.
 */

import { relations } from "drizzle-orm";

import { answers } from "./answers";
import { banInfos } from "./ban-info";
import { comments } from "./comments";
import { commentsReactions } from "./comments-reactions";
import { degrees } from "./degrees";
import { dots } from "./dots";
import { groups } from "./groups";
import { happenings } from "./happenings";
import { happeningsToGroups } from "./happenings-to-groups";
import { questions } from "./questions";
import { reactions } from "./reactions";
import { registrations } from "./registrations";
import { sessions } from "./sessions";
import { shoppingListItems } from "./shopping-list-items";
import { spotRanges } from "./spot-ranges";
import { users } from "./users";
import { usersToGroups } from "./users-to-groups";
import { usersToShoppingListItems } from "./users-to-shopping-list-items";

export const usersRelations = relations(users, ({ one, many }) => ({
  degree: one(degrees, {
    fields: [users.degreeId],
    references: [degrees.id],
  }),
  memberships: many(usersToGroups),
  likes: many(usersToShoppingListItems),
  dots: many(dots, {
    relationName: "dots",
  }),
  comments: many(comments),
  banInfo: one(banInfos, {
    fields: [users.id],
    references: [banInfos.userId],
    relationName: "banInfo",
  }),
}));

export const banInfoRelations = relations(banInfos, ({ one }) => ({
  user: one(users, {
    fields: [banInfos.userId],
    references: [users.id],
    relationName: "banInfo",
  }),
  bannedByUser: one(users, {
    fields: [banInfos.bannedBy],
    references: [users.id],
  }),
}));

export const degreesRelations = relations(degrees, ({ many }) => ({
  users: many(users),
}));

export const dotsRelations = relations(dots, ({ one }) => ({
  user: one(users, {
    fields: [dots.userId],
    references: [users.id],
    relationName: "dots",
  }),
  strikedByUser: one(users, {
    fields: [dots.strikedBy],
    references: [users.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: "replies",
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  replies: many(comments, {
    relationName: "replies",
  }),
  reactions: many(commentsReactions),
}));

export const commentsActionsRelations = relations(commentsReactions, ({ one }) => ({
  user: one(users, {
    fields: [commentsReactions.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [commentsReactions.commentId],
    references: [comments.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const reactionsRelations = relations(reactions, ({ one }) => ({
  user: one(users, {
    fields: [reactions.userId],
    references: [users.id],
  }),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(usersToGroups),
  happenings: many(happeningsToGroups),
}));

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
}));

export const happeningsRelations = relations(happenings, ({ many }) => ({
  registrations: many(registrations),
  spotRanges: many(spotRanges),
  questions: many(questions),
  groups: many(happeningsToGroups),
}));

export const happeningsToGroupsRelations = relations(happeningsToGroups, ({ one }) => ({
  happening: one(happenings, {
    fields: [happeningsToGroups.happeningId],
    references: [happenings.id],
  }),
  group: one(groups, {
    fields: [happeningsToGroups.groupId],
    references: [groups.id],
  }),
}));

export const spotRangesRelations = relations(spotRanges, ({ one }) => ({
  happening: one(happenings, {
    fields: [spotRanges.happeningId],
    references: [happenings.id],
  }),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  happening: one(happenings, {
    fields: [questions.happeningId],
    references: [happenings.id],
  }),
  answers: many(answers),
}));

export const registrationsRelations = relations(registrations, ({ one, many }) => ({
  happening: one(happenings, {
    fields: [registrations.happeningId],
    references: [happenings.id],
  }),
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
  answers: many(answers),
  changedByUser: one(users, {
    fields: [registrations.changedBy],
    references: [users.id],
  }),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  user: one(registrations, {
    fields: [answers.userId, answers.happeningId],
    references: [registrations.userId, registrations.happeningId],
  }),
  happening: one(happenings, {
    fields: [answers.happeningId],
    references: [happenings.id],
  }),
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));

export const shoppingListItemsRelations = relations(shoppingListItems, ({ one, many }) => ({
  user: one(users, {
    fields: [shoppingListItems.userId],
    references: [users.id],
  }),
  likes: many(usersToShoppingListItems),
}));

export const usersToShoppingListItemsRelations = relations(usersToShoppingListItems, ({ one }) => ({
  user: one(users, {
    fields: [usersToShoppingListItems.userId],
    references: [users.id],
  }),
  item: one(shoppingListItems, {
    fields: [usersToShoppingListItems.itemId],
    references: [shoppingListItems.id],
  }),
}));
