export const networkConfig = {
    "80001": [
        {
            mixerAddress: "0x6Ee89F6d43fd9d40dbB3cDbCA1692c99A090f72C", //proxy deployment
            token_icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
            alt: "MATIC",
            networkName: "Mumbai"
        },
    ],

    "32520": [
        {
            mixerAddress: "0xF09f5824c693804Be9573f5f75f7d3f0F97e1437", //proxy deployment
            token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "ETH",
            networkName: "Rinkeby"

        },
    ],
    "56": [
        {
            mixerAddress: "0x42CC424D6a821058C29105f57c409d40991FB316", //proxy address
            token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "KAI",
            networkName: "kardiachain_main"
        }
    ],
    "97": [
        {
            mixerAddress: "0x15BA1eaB00e5E130d142B6B364357251566c1999",
            token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "BSC",
            networkName: "binance-testnet"
        }
    ]
}

export const getConfigByChain = (chain) => networkConfig[chain]
