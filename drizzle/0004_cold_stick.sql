ALTER TABLE "execrises" RENAME TO "exercises";--> statement-breakpoint
ALTER TABLE "workout_execrises" RENAME TO "workout_exercises";--> statement-breakpoint
ALTER TABLE "workout_exercises" RENAME COLUMN "execrise_id" TO "exercise_id";--> statement-breakpoint
ALTER TABLE "workout_session_sets" RENAME COLUMN "execrise_id" TO "exercise_id";--> statement-breakpoint
ALTER TABLE "exercises" DROP CONSTRAINT "execrises_slug_unique";--> statement-breakpoint
ALTER TABLE "exercises" DROP CONSTRAINT "execrises_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "workout_exercises" DROP CONSTRAINT "workout_execrises_workout_id_workouts_id_fk";
--> statement-breakpoint
ALTER TABLE "workout_exercises" DROP CONSTRAINT "workout_execrises_execrise_id_execrises_id_fk";
--> statement-breakpoint
ALTER TABLE "workout_session_sets" DROP CONSTRAINT "workout_session_sets_execrise_id_execrises_id_fk";
--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_session_sets" ADD CONSTRAINT "workout_session_sets_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_slug_unique" UNIQUE("slug");