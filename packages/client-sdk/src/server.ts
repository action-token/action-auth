// Server-only exports - no CSS imports or client components
export { auth } from "./lib/server/auth/index";
export { stellar } from "./lib/server/auth/plugins/stellar";

// Re-export useful types from better-auth
export type { BetterAuthPlugin } from "better-auth";
export type { StellarPluginOptions } from "./lib/server/auth/plugins/stellar";
