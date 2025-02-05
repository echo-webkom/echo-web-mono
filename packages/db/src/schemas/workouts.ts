import { relations, type InferSelectModel } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { tournaments, users } from ".";

export const workouts = pgTable("workout", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  varighet: integer("varighet").notNull(),
  info: text("info"),
  userId: integer("userID").notNull(),
  tournamentId: integer("tournamentID").notNull(),
});

export const workoutRelations = relations(workouts, ({ one }) => ({
  tournamentUser: one(users, {
    fields: [workouts.userId],
    references: [users.id],
  }),
  tournaments: one(tournaments, {
    fields: [workouts.tournamentId],
    references: [tournaments.id],
  }),
}));

export type Workout = InferSelectModel<typeof workouts>;
export type WorkoutInsert = InferSelectModel<typeof workouts>;

export const selectWorkoutSchema = createSelectSchema(workouts);
export const insertWorkoutSchema = createInsertSchema(workouts);
