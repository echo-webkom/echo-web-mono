import { relations, type InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { tournaments, users } from ".";

export const tournamentUsers = pgTable("tournamentUser", {
  id: serial("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  tournamentId: text("tournament_id")
    .notNull()
    .references(() => tournaments.id, {
      onDelete: "cascade",
    }),
});

export const tournamentUserRelation = relations(tournamentUsers, ({ one }) => ({
  tournamentUser: one(users, {
    fields: [tournamentUsers.userId],
    references: [users.id],
  }),
  tournaments: one(tournaments, {
    fields: [tournamentUsers.tournamentId],
    references: [tournaments.id],
  }),
}));

export type tournamentUser = InferSelectModel<typeof tournamentUsers>;
export type tournamentUserInsert = InferSelectModel<typeof tournamentUsers>;

export const selectTournamentUserSchema = createSelectSchema(tournamentUsers);
export const insertTournamentUsersSchema = createInsertSchema(tournamentUsers);
