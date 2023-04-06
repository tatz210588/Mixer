import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import logo from "../assets/logo.png";
// import PhoneInput from 'react-phone-number-input'
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { FcSettings } from "react-icons/fc";
import { CgProfile } from "react-icons/cg";
import { AiOutlineQrcode } from "react-icons/ai";
import { BsCashCoin } from "react-icons/bs";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
//import PhoneLink from '../artifacts/contracts/phoneLink.sol/phoneLink.json'
//import { getConfigByChain } from "../config";
import Web3Modal from "web3modal";
import { useAccount, useNetwork } from "wagmi";
import { ellipseAddress } from "./utils";
import toast from "react-hot-toast";
import { FaRegAddressCard } from "react-icons/fa";
// import CircleLoader from 'react-spinners/CircleLoader'
// import Modal from 'react-modal'
// import qrlogo from '../assets/QR.png'

const solutions = [
  {
    name: "MY Profile",
    description: "Get your QR code, connected details and linked wallets.",
    href: "/myprofile",
    icon: FcSettings,
  },
  {
    name: "Send Crypto",
    description:
      "Send your crypto to your friend on his phone/email ID directly.",
    href: "/pay",
    icon: BsCashCoin,
  },
  {
    name: "Scan",
    description:
      "Scan and send crypto to your friend directly on his/her QR code.",
    href: "/qrPay",
    icon: AiOutlineQrcode,
  },
  {
    name: "KYC",
    description: "Upload your KYC documents to increase transfer limit",
    href: "#",
    icon: FaRegAddressCard,
  },
];

const style = {
  wrapper: `flex flex-wrap items-end content-around bg-[#E6cf7c] px-[1.2rem] p-1 `,
  logoContainer: `flex items-center lg:py-4 flex-shrink-0 text-[#000000] mr-6 cursor-pointer`,
  logoText: ` ml-[3.8rem] mt-10 font-bold text-2xl tracking-tight text-[#000000]`,
  headerItemsTab: `w-full  block flex-grow lg:flex lg:items-center lg:w-auto`,
  headerItems: `text-md lg:flex justify-end items-center font-bold lg:flex-grow`,
  // headerItem: `block mt-4 lg:inline-block lg:text-right lg:mt-0 lg:mb-2 py-2 text-[#000000] hover:text-[#81817C] mr-6 cursor-pointer `,
  headerIcon: `block lg:inline-block lg:mt-0 text-[#000000]  text-3xl hover:text-[#81817C] mr-4 cursor-pointer focus:outline-none`,
  img: `fill-current h-8 w-8 mr-2`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  infoRight: `flex-0.4 text-right`,
};

const Header = () => {
  const [done, setDone] = useState(false);
  const [openMenu, setOpenMenu] = React.useState(true);
  const [defaultAccount, setDefaultAccount] = useState<any>(null);
  const [currNet, setCurrNet] = useState<number>(0);

  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    if (!(window as any).ethereum) {
      toast.error(
        "Install a crypto wallet(ex: Metamask, Coinbase, etc..) to proceed"
      );
    } else if (!defaultAccount) {
      toast.error("Connect Your Wallet.");
    } else {
      toast.success(`Welcome ${ellipseAddress(defaultAccount as string)} !!`);
      onLoad();
    }
    setDone(true);
  }, [currNet, defaultAccount]);

  const onLoad = async () => {
    await (window as any).ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    ); //create provider
    const signer = provider.getSigner();
    const network = await provider.getNetwork();
    setDefaultAccount(accounts[0]);
    setCurrNet(network?.chainId);
  };

  return (
    <nav className="flex flex-wrap items-center justify-between bg-lime-50 px-2">
      <Link href="/">
        <div className="mr-6 flex flex-shrink-0 items-center text-white">
          {/* <Image className={style.img} src={logo} height={40} width={40} /> */}
          <div className={style.logoText}>MIXER</div>
        </div>
      </Link>
      <div className="block lg:hidden">
        <button
          onClick={handleBtnClick}
          className="flex items-center rounded border border-[#000000] px-3 py-2 text-[#000000] hover:border-black hover:text-black"
        >
          <svg
            className="h-3 w-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="block w-full flex-grow lg:flex lg:w-auto lg:items-center">
        {openMenu && (
          <div className={style.headerItemsTab}>
            <div className={style.headerItems}>
              {/* <Link href="/">
                <div className={style.headerItem}>Home</div>
              </Link>
              <Link href="/register">
                <div className={style.headerItem}>Link Wallet</div>
              </Link>
              {data?.address === admin && data ? (
                <Link href="/superman">
                  <div className={style.headerItem}>Admin</div>
                </Link>
              ) : (
                <div className={style.headerItem}></div>
              )} */}

              {/* {data?.address && (
                <Popover.Group as="nav" className={style.headerIcon}>
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button>
                          <span>
                            <CgProfile />
                          </span>
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute z-10 -ml-4 mt-3 max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:w-screen lg:-translate-x-1/2">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="relative grid gap-6 bg-[#dfe8f7] px-5 py-6 sm:gap-8 sm:p-8">
                                {solutions.map((item, i) => (
                                  <Link key={i} href={item.href}>
                                    <div className="-m-3 flex items-start rounded-lg p-3 hover:bg-[#b6f7fc]">
                                      <item.icon
                                        key={i}
                                        className="h-6 w-6 flex-shrink-0 text-indigo-600"
                                        aria-hidden="true"
                                      />
                                      <div className="ml-4">
                                        <p className="text-base font-medium text-gray-900">
                                          {item.name}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                          {item.description}
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </Popover.Group>
              )} */}
              <div className={style.headerItems}>
                <ConnectButton showBalance={false} chainStatus="icon" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
