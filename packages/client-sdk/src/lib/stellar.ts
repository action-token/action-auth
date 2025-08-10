// Minimal Stellar client helper for Albedo + Better Auth plugin endpoints
import type { AuthClient } from "./auth-client";
import albedo, {
  type PublicKeyIntentResult,
  type TxIntentResult,
} from "@albedo-link/intent";

export type StartStellarResult = {
  xdr: string;
  networkPassphrase: string;
  nonce: string;
  expiresAt: string;
};

export async function signInWithAlbedo(authClient: AuthClient) {
  // 1) get public key from Albedo
  // You can hint network: "public" | "testnet"; leaving empty lets Albedo decide
  const pub: PublicKeyIntentResult = await albedo.publicKey({});
  const account: string = pub.pubkey;
  if (!account) throw new Error("Failed to get Albedo public key");

  // 2) request challenge
  const { data: challenge, error: challengeErr } = await (
    authClient as any
  ).$fetch("/stellar/challenge", {
    method: "GET",
    query: { account },
  });
  if (!challenge) throw new Error(challengeErr || "Failed to get challenge");

  // 3) sign XDR with Albedo
  // Albedo expects network identifier: "public" | "testnet" | passphrase
  const np = challenge.networkPassphrase?.toLowerCase?.() || "";
  const networkIdent = np.includes("public")
    ? "public"
    : np.includes("test")
      ? "testnet"
      : challenge.networkPassphrase;
  const signed: TxIntentResult = await albedo.tx({
    xdr: challenge.xdr,
    network: networkIdent,
    pubkey: account,
  });
  const xdr: string = signed.signed_envelope_xdr || signed.xdr;
  if (!xdr) throw new Error("Failed to sign transaction");

  // 4) verify
  const { data: verified, error: verifyErr } = await (authClient as any).$fetch(
    "/stellar/verify",
    {
      method: "POST",
      body: { xdr, account },
    }
  );
  if (!verified?.status) throw new Error(verifyErr || "Verification failed");
  return true;
}
