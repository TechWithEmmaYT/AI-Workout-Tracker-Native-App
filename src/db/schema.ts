import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

export const genderEnum = pgEnum("gender", ["male", "female"]);
export const goalEnum = pgEnum("goal", [
  "build-muscle",
  "lose-fat",
  "maintain",
]);
export const experienceEnum = pgEnum("experience", [
  "beginner",
  "intermediate",
  "advanced",
]);
export const weightUnitEnum = pgEnum("weight_unit", ["kg", "lb"]);

export const profiles = pgTable("profiles", {
  id: uuid().defaultRandom().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  gender: genderEnum().notNull(),
  goal: goalEnum().notNull(),
  experience: experienceEnum().notNull(),
  weightUnit: weightUnitEnum().notNull().default("kg"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const workouts = pgTable("workouts", {
  id: uuid().defaultRandom().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text().notNull(),
  description: text(),
  image: text(),
  isTemplate: boolean().notNull().default(false),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const exercises = pgTable("exercises", {
  id: uuid().defaultRandom().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  slug: text().notNull().unique(),
  name: text().notNull(),
  image: text(),
  description: text().notNull(),
  muscles: text().notNull(),
  equipment: text(),
  difficulty: text().notNull(),
  forceType: text(),
  mechanics: text(),
  category: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: uuid().defaultRandom().primaryKey(),
  workoutId: uuid()
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: uuid()
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  sets: integer().notNull(),
  reps: integer().notNull(),
  targetWeight: real(),
  restSeconds: integer().notNull(),
  position: integer().notNull(),
});

export const workoutSessions = pgTable("workout_sessions", {
  id: uuid().defaultRandom().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  workoutId: uuid()
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  startedAt: timestamp({ withTimezone: true }).notNull(),
  completedAt: timestamp({ withTimezone: true }).notNull(),
  durationSeconds: integer().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const workoutSessionSets = pgTable("workout_session_sets", {
  id: uuid().defaultRandom().primaryKey(),
  sessionId: uuid()
    .notNull()
    .references(() => workoutSessions.id, { onDelete: "cascade" }),
  exerciseId: uuid()
    .notNull()
    .references(() => exercises.id),
  setNumber: integer().notNull(),
  reps: integer().notNull(),
  weight: real(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Exercise = typeof exercises.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type WorkoutSessionSet = typeof workoutSessionSets.$inferSelect;
