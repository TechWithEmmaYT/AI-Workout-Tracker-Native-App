import { expoClient } from "@better-auth/expo/client";
import { BetterAuthClientPlugin } from "better-auth";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const API_URL = process.env.EXPO_PUBLIC_API_URL!;
export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: "aiworkouttracker",
      storagePrefix: "myworkout",
      storage: SecureStore,
    }) as BetterAuthClientPlugin,
  ],
});
