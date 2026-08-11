import { defineConfig } from "drizzle-kit";

process.loadEnvFile();

export default defineConfig({
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL! },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/db/schema.ts",
});
