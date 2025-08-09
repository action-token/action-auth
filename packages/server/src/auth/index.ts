import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; // your drizzle instance
// import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  // plugins: [expo()],
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"
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
    "myapp://",
    "http://localhost:8081",
    "http://localhost:5173",
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: "None", // Use "None" for cross-origin
      secure: true,
      // httpOnly: true,
      // path: "/",
      // partitioned: true, // New browser standards will mandate this for foreign cookies
    },
  },
});
