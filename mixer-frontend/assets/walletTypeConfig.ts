export type WalletInfo = {
  type: string;
};

const walletTypeConfig: Record<number, WalletInfo[]> = {
  "97": [
    {
      type: "--Select--",
    },
    {
      type: "Peer to Peer (P2P) Wallet",
    },
    {
      type: "Centralized Exchange (CeX) Wallet",
    },
  ],
  "56": [
    {
      type: "--Select--",
    },
    {
      type: "Peer to Peer (P2P) Wallet",
    },
    // {
    //   type: "Centralized Exchange (CeX) Wallet",
    // },
  ],
};

export const getWalletTypeByChain = (chain: number) => walletTypeConfig[chain];
