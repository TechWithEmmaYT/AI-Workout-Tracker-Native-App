import { db, profiles } from "@/db";
import * as schema from "@/db/schema";
import { expo } from "@better-auth/expo";
import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { onboardingValuesSchema } from "./validations/onboarding-validation";

const AUTH_URL = process.env.BETTER_AUTH_URL!;

const getOnboarding = (body: unknown) => {
  const result = onboardingValuesSchema.safeParse(body);
  if (!result.success) {
    throw new APIError("BAD_REQUEST", {
      message: "Invalid onboarding details",
    });
  }
  return result.data;
};

export const auth = betterAuth({
  appName: "MyWorkout",
  baseURL: AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [
    "aiworkouttracker://",
    "aiworkouttracker//*",

    "exp://",
    "exp://*",
    "exp://**",
    "exp://192.168.*.*:*/**",
    "http://localhost:*",
    "http://192.168.*.*:*",
    AUTH_URL,

    // ...(process.env.NODE_ENV === "development"
    //   ? [
    //       "exp://", // Trust all Expo URLs (prefix matching)
    //       "exp://**", // Trust all Expo URLs (wildcard matching)
    //       "exp://192.168.*.*:*/**", // Trust 192.168.x.x IP range with any port and path
    //     ]
    //   : []),
  ].filter(Boolean),
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") getOnboarding(ctx.body);
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path != "/sign-up/email" || !ctx.context.newSession) return;
      await db.insert(profiles).values({
        userId: ctx.context.newSession.user.id,
        ...getOnboarding(ctx.body),
      });
    }),
  },
  plugins: [expo()],
});

export type AuthSession = typeof auth.$Infer.Session;
