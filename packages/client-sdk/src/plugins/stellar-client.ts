import type { BetterAuthClientPlugin } from "better-auth/client";
import type { BetterFetchOption } from "@better-fetch/fetch";
import albedo, {
  type PublicKeyIntentResult,
  type TxIntentResult,
} from "@albedo-link/intent";

type ChallengeResponse = {
  xdr: string;
  networkPassphrase: string;
  nonce: string;
  expiresAt: string;
};

export const stellarClient = () => {
  return {
    id: "stellar",
    getActions: ($fetch) => {
      return {
        // Low-level endpoints
        challenge: async (
          args: { account: string },
          fetchOptions?: BetterFetchOption
        ) =>
          $fetch<ChallengeResponse>("/stellar/challenge", {
            method: "GET",
            query: { account: args.account },
            ...fetchOptions,
          }),
        verify: async (
          args: { xdr: string; account: string },
          fetchOptions?: BetterFetchOption
        ) =>
          $fetch<{ status: boolean }>("/stellar/verify", {
            method: "POST",
            body: args,
            ...fetchOptions,
          }),

        // High-level Albedo sign-in (popup + verify)
        signInWithAlbedo: async (fetchOptions?: BetterFetchOption) => {
          const pub: PublicKeyIntentResult = await albedo.publicKey({});
          const account = pub.pubkey;
          if (!account)
            return { data: null, error: "failed_to_get_pubkey" } as const;

          const { data: challenge, error: cErr } =
            await $fetch<ChallengeResponse>("/stellar/challenge", {
              method: "GET",
              query: { account },
              ...fetchOptions,
            });
          if (!challenge)
            return { data: null, error: cErr || "challenge_failed" } as const;

          const np = challenge.networkPassphrase?.toLowerCase?.() || "";
          const networkIdent = np.includes("public")
            ? "public"
            : np.includes("test")
              ? "testnet"
              : (challenge.networkPassphrase as any);

          const signed: TxIntentResult = await albedo.tx({
            xdr: challenge.xdr,
            network: networkIdent,
            pubkey: account,
          });
          const xdr: string =
            (signed as any).signed_envelope_xdr || (signed as any).xdr;
          if (!xdr) return { data: null, error: "sign_failed" } as const;

          const { data: verified, error: vErr } = await $fetch<{
            status: boolean;
          }>("/stellar/verify", {
            method: "POST",
            body: { xdr, account },
            ...fetchOptions,
          });
          if (!verified?.status)
            return { data: null, error: vErr || "verify_failed" } as const;

          return { data: { status: true }, error: null } as const;
        },
      };
    },
  } satisfies BetterAuthClientPlugin;
};

export default stellarClient;
