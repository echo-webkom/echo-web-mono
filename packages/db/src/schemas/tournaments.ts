import { relations, type InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { tournamentUsers } from ".";

export const tournaments = pgTable("tournament", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull(),
  sportId: text("sport_id").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  tournamentUserId: text("tournament_user_id")
    .notNull()
    .references(() => tournamentUsers.id, {
      onDelete: "cascade",
    }),
});

export const tournamentRelations = relations(tournaments, ({ one }) => ({
  tournamentUser: one(tournamentUsers, {
    fields: [tournaments.tournamentUserId],
    references: [tournamentUsers.userId],
  }),
}));

export type Tournament = InferSelectModel<typeof tournaments>;
export type TournamentInsert = InferSelectModel<typeof tournaments>;

export const selectTournamentSchema = createSelectSchema(tournaments);
export const insertTournamentSchema = createInsertSchema(tournaments);
