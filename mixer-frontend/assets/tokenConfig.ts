export type TokenInfo = {
  name: string;
  address: string;
  symbol: string;
  decimal: number;
};

const tokenConfig: Record<number, TokenInfo[]> = {
  "80001": [
    {
      name: "---Select Your Crypto---",
      address: "0x000",
      symbol: "SELECT",
      decimal: 18,
    },
    {
      name: "MATIC",
      address: "null",
      symbol: "MATIC",
      decimal: 18,
    },
    {
      name: "Lolo Coins",
      address: "0x90179ba681708dC36C38828153130D5B7836b7D5",
      symbol: "LOLO",
      decimal: 18,
    },

    {
      name: "USD Tether",
      address: "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832",
      symbol: "USDT",
      decimal: 6,
    },
  ],
  "32520": [
    {
      name: "---Select Your Crypto---",
      address: "0x000",
      symbol: "SELECT",
      decimal: 18,
    },
    {
      name: "BRISE",
      address: "null",
      symbol: "BRISE",
      decimal: 18,
    },
  ],
  "0": [
    {
      name: "---Select Your Crypto---",
      address: "0x000",
      symbol: "SELECT",
      decimal: 18,
    },
  ],
  "56": [
    {
      name: "---Select Your Crypto---",
      address: "0x000",
      symbol: "SELECT",
      decimal: 18,
    },
    {
      name: "BNB",
      address: "null",
      symbol: "BNB",
      decimal: 18,
    },
    {
      name: "USD Tether",
      address: "0x55d398326f99059ff775485246999027b3197955",
      symbol: "USDT",
      decimal: 18,
    },
    {
      name: "BUSD",
      address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      symbol: "BUSD",
      decimal: 18,
    },
  ],
  "97": [
    {
      name: "---Select Your Crypto---",
      address: "0x000",
      symbol: "SELECT",
      decimal: 18,
    },
    {
      name: "BNB",
      address: "null",
      symbol: "BNB",
      decimal: 18,
    },

    {
      name: "USDT",
      address: "0xACd8B7599d8416619eAB223c9D4B60F5C55a7E4c",
      symbol: "USDT",
      decimal: 18,
    },
    {
      name: "GLD (Tatz test Token)",
      address: "0xACd8B7599d8416619eAB223c9D4B60F5C55a7E4c",
      symbol: "USDT",
      decimal: 18,
    },
    {
      name: "BUSD",
      address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      symbol: "BUSD",
      decimal: 18,
    },
  ],
};

export const getTokenByChain = (chain: number) => tokenConfig[chain];
