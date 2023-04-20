import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import * as globeLoaderData from "../assets/globe.json";
import * as successLoaderData from "../assets/success.json";
import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
  // wallet,
  Chain,
  darkTheme,
  lightTheme,
  AvatarComponent,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const globeLoader = {
  loop: true,
  autoplay: true,
  animationData: globeLoaderData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const successLoader = {
  loop: true,
  autoplay: true,
  animationData: successLoaderData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};



const Binance_mainnet: Chain = {
  id: 56,
  name: "Binance-mainnet",
  network: "Binance-mainnet",
  iconUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=024",
  iconBackground: "#d7fc03",
  nativeCurrency: {
    decimals: 18,
    name: "BSC",
    symbol: "BSC",
  },
  rpcUrls: {
    default:  'https://bsc-dataseed.binance.org/' ,
  },
  blockExplorers: {
    default: { name: "BSC-Scanner", url: "https://bscscan.com/" },
  },
  testnet: false,
};

const Binance_testnet: Chain = {
  id: 97,
  name: "Smart Chain - Testnet",
  network: "Smart Chain - Testnet",
  iconUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=024",
  iconBackground: "#d7fc03",
  nativeCurrency: {
    decimals: 18,
    name: "BSC",
    symbol: "BSC",
  },
  rpcUrls: {
    public: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    default: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  },
  blockExplorers: {
    default: { name: "BSC-Scanner", url: "https://testnet.bscscan.com" },
  },
  testnet: false,
};

const { chains, provider } = configureChains(
  [Binance_mainnet,Binance_testnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://${chain.id}.example.com`,
      }),
    }),
  ],
);

const {connectors} = getDefaultWallets({
  appName: "My App",
  chains
})

// const connectors = connectorsForWallets([
//   {
//     groupName: "Recommended",
//     wallets: [
//       wallet.rainbow({ chains }),
//       wallet.walletConnect({ chains }),
//       wallet.metaMask({ chains }),
//       wallet.trust({ chains }),
//       wallet.argent({ chains }),
//       wallet.coinbase({ appName: "My App", chains }),
//       wallet.brave({ chains }),
//       wallet.steak({ chains }),
//     ],
//   },
// ]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const linkPhoneWithWallet = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [loaderSize, setLoaderSize] = useState(320);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
      setTimeout(() => {
        setCompleted(true);
      }, 1000);
    }, 4000);
  }, []);

  return (
    <>
      {!completed ? (
        <div className="loading-container container">
          {!loading ? (
            <Lottie
              options={globeLoader}
              height={loaderSize}
              width={loaderSize}
            />
          ) : (
            <Lottie
              options={successLoader}
              height={loaderSize}
              width={loaderSize}
            />
          )}
        </div>
      ) : (
        // <WagmiConfig client={wagmiClient}>
        //   <RainbowKitProvider
        //     chains={chains}
        //     theme={lightTheme()}
        //     coolMode
        //     showRecentTransactions={true}
        //   >
          <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            coolMode
            chains={chains}
            theme={darkTheme({
              accentColor: "#04807b",
              accentColorForeground: "white",
              borderRadius: "medium",
            })}
          >
            <Header />
            <Toaster position="top-center" reverseOrder={false} />
            <Component {...pageProps} />
            <Footer />
          </RainbowKitProvider>
        </WagmiConfig>
      )}
    </>
  );
};

export default linkPhoneWithWallet;
