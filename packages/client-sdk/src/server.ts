// Server-only exports - no CSS imports or client components
export { createAuth } from "./lib/server/auth/index";
export { stellar } from "./lib/server/auth/plugins/stellar";
export * as authSchema from "./lib/server/auth/schema/auth";

// Re-export useful types from better-auth
export type { BetterAuthPlugin } from "better-auth";
export type { StellarPluginOptions } from "./lib/server/auth/plugins/stellar";
