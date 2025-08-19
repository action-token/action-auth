import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  XBULL_ID,
  ALBEDO_ID,
  LOBSTR_ID,
} from "@creit.tech/stellar-wallets-kit";

export const kit: StellarWalletsKit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: XBULL_ID,
  modules: allowAllModules(),
});

// kit.setWallet(ALBEDO_ID) // to set a specific wallet type

// const { address } = await kit.getAddress();
// // AND THEN
// const { signedTxXdr } = await kit.signTransaction("XDR_HERE", {
//   address,
//   networkPassphrase: WalletNetwork.PUBLIC,
// });
