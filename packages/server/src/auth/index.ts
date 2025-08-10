import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; // your drizzle instance
import { stellar } from "./plugins/stellar";
// import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  // Register Stellar plugin (minimal SEP-10)
  plugins: [
    // expo(),
    stellar({
      network: (process.env.STELLAR_NETWORK as any) || "TESTNET",
      serverSecret: process.env.STELLAR_SERVER_SECRET as string,
      webAuthDomain: process.env.WEB_AUTH_DOMAIN as string,
      homeDomain: process.env.HOME_DOMAIN as string,
      emailDomainName: process.env.EMAIL_DOMAIN_NAME || "stellar.local",
      challengeTTL: 300,
    }),
  ],
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
