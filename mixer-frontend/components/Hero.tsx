import { useState, useEffect } from "react";
import { getTokenByChain, TokenInfo } from "../assets/tokenConfig";
import { getWalletTypeByChain, WalletInfo } from "../assets/walletTypeConfig";
import { useAccount, useNetwork } from "wagmi";
import { FaBackspace, FaMoneyBillWave } from "react-icons/fa";
import Mixer from "../artifacts/contracts/Mixer.sol/Mixer.json";
import Token from "../artifacts/contracts/erc20Token.sol/GLDToken.json";
import toast from "react-hot-toast";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { getConfigByChain } from "../config";
import BigNumber from "bignumber.js";
import ClipLoader from "react-spinners/ClipLoader";

const baseUrl = "https://mixer-backend.vercel.app";

const style = {
  wrapper: `relative`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.2 flex-wrap`,
  container: `flex flex-wrap before:content-['']  before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0  before:bg-cover before:bg-center before:bg-fixed before:opacity-100 bg-lime-50	`,
  contentWrapper: `w-full m-4 h-screen overflow-auto justify-center flex-wrap items-center block flex-grow lg:flex lg:items-center lg:w-auto bg-lime-50	`,
  details: ``,
  center: ` h-screen relative justify-center flex-wrap items-center `,
  searchBar: `flex flex-1 w-full border-black items-center bg-[#faf9f7] rounded-[1.0rem] mt-2 bg-lime-200`,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-5 text-[#000000] placeholder:text-[#5e5d5b] placeholder:text-sm`,
  copyContainer: `flex flex-1 w-full border-black items-center bg-[#faf9f7] rounded-[0.8rem]`,
  title: `relative text-black justify-center text-2xl lg:text-[46px] font-semibold`,
  description: `text-[#000000] container-[400px] text-lg lg:text-lg mt-[0.8rem] mb-[2.5rem]`,
  spinner: `w-full h-screen flex justify-center text-white mt-20 p-100 object-center`,
  nftButton: `font-bold w-9/12 mt-10 bg-[#43058f] text-white text-lg rounded-[2.2rem] p-3  shadow-lg hover:bg-lime-400	 cursor-pointer bg-lime-500	`,
  dropDown: `font-bold w-full mt-4  text-black text-sm lg:text-lg rounded-[1.8rem] p-4 shadow-sm cursor-pointer bg-lime-200`,
  dropDownCrypto: `font-bold w-9/12 mt-4  text-black text-sm lg:text-lg rounded-[1.8rem] p-4 shadow-sm cursor-pointer bg-lime-200`,
  option: `font-bold w-1/2 lg:w-full mt-4 bg-[#2181e2] text-white text-sm lg:text-lg rounded p-4 shadow-lg cursor-pointer`,
  glowDivBox: `relative group w-full lg:w-[40%] mt-30 rounded-2xl mr-2  w-screen  justify-center  `,
};

const defaults = {
  balanceToken: "0",
};

const Pay = () => {
  //const { chain, chains } = useNetwork();
  const [availableTokens, setAvailableTokens] = useState<TokenInfo[]>([]);
  const [availableWalletType, setAvailableWalletType] = useState<WalletInfo[]>(
    []
  );
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [tokenAddr, setTokenAddr] = useState<string>("");
  const [tokenMin, setTokenMin] = useState<string>("");
  const [tokenSym, setTokenSym] = useState<string>("");
  const [withdrawPanel, setWithdrawPanel] = useState<Boolean>(true);
  const [selectedOption, setSelectedOption] = useState<string>();
  const [balanceToken, setBalanceToken] = useState(defaults.balanceToken);
  const [formInput, updateFormInput] = useState({
    target: "",
    amount: 0.0,
  });
  const [allowed, setAllowed] = useState<any>(false);
  const [loadingState, setLoadingState] = useState<Boolean>(false);
  const [defaultAccount, setDefaultAccount] = useState<any>(null);
  const [currNet, setCurrNet] = useState<number>(0);
  const fee: number = 0.01;

  useEffect(() => {
    onLoad();
    setAvailableTokens(getTokenByChain(currNet));
    setAvailableWalletType(getWalletTypeByChain(currNet));
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

  const saveTransaction = async (innerContract: any) => {
    await (window as any).ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    const myAddress = accounts[0];
    const body = {
      from: myAddress,
      to: formInput?.target,
      coin: selectedOption,
      contract: innerContract,
      amount: formInput?.amount,
      status: "pending",
    };
    const headers = { "Content-Type": "application/json" };

    return await fetch(`${baseUrl}/save/trnx`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        const { status } = response;
        console.log("Status", status);
      })
      .catch((e) => console.log("error is", e));
  };

  async function getMyBalance() {
    toast.success(`Balance: ${await getBalance()}`);
  }

  async function getBalance() {
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    const myAddress = accounts[0];
    var balance;
    await fetch(`${baseUrl}/get/balance/${myAddress}/${selectedOption}`)
      .then(async (result) => {
        await result.json().then((resp) => {
          balance = resp.result;
        });
      })
      .catch((e) => {
        toast.error(`Error is ${e}`);
      });
    return balance;
  }

  async function withdraw(e: any) {
    const balance = await getBalance();
    if (balance === 0) {
      console.log("if");
      toast.error(`Nothing to withdraw for you`);
    } else {
      console.log("else");
      await (window as any).ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      const myAddress = accounts[0];
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      ); //create provider
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const contract = new ethers.Contract(
        getConfigByChain(network?.chainId)[0].mixerAddress,
        Mixer.abi,
        signer
      );
      var tx: any;
      console.log(`${baseUrl}/get/data/${myAddress}/${selectedOption}`);

      await fetch(`${baseUrl}/get/data/${myAddress}/${selectedOption}`)
        .then(async (result) => {
          await result.json().then((resp) => {
            resp.map(async (e: any) => {
              if (tokenAddr === "null") {
                tx = await contract.withdraw(
                  e.contract,
                  "0x0000000000000000000000000000000000000000",
                  ethers.utils.parseUnits(e.amount.toString(), "ether"),
                  e.from
                  //,{ value: etherPrice }
                );
                const receipt = await provider
                  .waitForTransaction(tx.hash, 1, 150000)
                  .then(async () => {
                    toast.success("Withdrawal completed !!");
                  })
                  .catch((e) => {
                    toast.error("Transaction failed.");
                    toast.error(`Error is: ${e}`);
                  });
              } else {
                console.log("contract", e.contract);
                console.log();
                tx = await contract.withdraw(
                  e.contract,
                  tokenAddr,
                  ethers.utils.parseUnits(e.amount.toString(), "ether"),
                  e.from
                );
                const receipt = await provider
                  .waitForTransaction(tx.hash, 1, 150000)
                  .then(async () => {
                    toast.success("Withdrawal completed !!");
                  })
                  .catch((e) => {
                    toast.error("Transaction failed.");
                    toast.error(`Error is: ${e}`);
                  });
              }
              await fetch(`${baseUrl}/update/status/${e._id}`, {
                method: "PUT",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
              });
            });
          });
        })
        .catch((e) => {
          toast.error(`Error is ${e}`);
        });
    }
  }

  async function transfer(e: any) {
    e?.preventDefault();

    if (
      !formInput.target ||
      !selectedWallet ||
      !selectedOption ||
      !formInput.amount
    ) {
      toast.error("All fields are mandatory!");
      return;
    }
    if (formInput.amount < parseFloat(tokenMin) || formInput.amount <= 0) {
      toast.error(`Minimum Deposit ${tokenMin} ${tokenSym}`);
      return;
    } else {
      await (window as any).ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      const myAddress = accounts[0];

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      ); //create provider
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const contract = new ethers.Contract(
        getConfigByChain(network?.chainId)[0].mixerAddress,
        Mixer.abi,
        signer
      );
      var tx;
      const innerContract = await contract.getCurrentContract();
      console.log("my addr", contract);
      //await saveTransaction(innerContract as any);

      if (tokenAddr === "null") {
        const val: number = Number(formInput?.amount) + fee;
        console.log("val", val);
        const etherPrice = ethers.utils.parseUnits(val.toString(), "ether");
        tx = await contract.depositTokens(
          "0x0000000000000000000000000000000000000000",
          0,
          formInput?.target,
          false,
          { value: etherPrice }
        );
      } else {
        const etherPrice = ethers.utils.parseUnits(fee.toString(), "ether");

        tx = await contract.depositTokens(
          tokenAddr,
          ethers.utils.parseUnits(formInput?.amount.toString(), "ether"),
          formInput?.target,
          false,
          { value: etherPrice }
        );
      }

      const receipt = await provider
        .waitForTransaction(tx.hash, 1, 150000)
        .then(async () => {
          toast.success("Transfer completed !!");
          await saveTransaction(innerContract as any);
          if (selectedWallet != "Peer to Peer (P2P) Wallet") {
            await withdraw(e);
          }
        })
        .catch((e) => {
          toast.error("Transaction failed.");
          toast.error(`Error is: ${e}`);
        });
    }
  }

  async function checkAllowance(token: any) {
    if (token != "null") {
      await (window as any).ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      ); //create provider
      const network = await provider.getNetwork();
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(token, Token.abi, signer);
      //use await function for handling promise
      if (defaultAccount) {
        const tx = await tokenContract.allowance(
          defaultAccount,
          getConfigByChain(network.chainId)[0].mixerAddress
        );
        formatBigNumber(tx) != "0" ? setAllowed(true) : setAllowed(false);
      }
    } else {
      setAllowed(true);
    }
  }
  async function approve() {
    await (window as any).ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    ); //create provider
    const network = await provider.getNetwork();
    const signer = provider.getSigner();
    console.log("tokenAdd", tokenAddr);
    const tokenContract = new ethers.Contract(
      tokenAddr as string,
      Token.abi,
      signer
    );
    const tx = await tokenContract.approve(
      getConfigByChain(network.chainId)[0].mixerAddress,
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    );
    toast("Approval in process... Please Wait", { icon: "👏" });
    //tx.hash is available only when writing transaction not reading
    const receipt = await provider
      .waitForTransaction(tx.hash, 1, 150000)
      .then(() => {
        toast.success(`You are successfully Approved `);
        setAllowed(true);
      });
  }
  function formatBigNumber(bn: any) {
    const divideBy = new BigNumber("10").pow(new BigNumber(18));
    const converted = new BigNumber(bn.toString());
    const divided = converted.div(divideBy);
    return divided.toFixed(0, BigNumber.ROUND_DOWN);
  }

  return (
    <div>
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.contentWrapper}>
            <div className={style.glowDivBox}>
              <div className="relative h-[full] w-[95%] justify-center rounded-lg bg-lime-100	 px-7 py-9  text-center leading-none lg:w-full">
                <>
                  <div className={style.details}>
                    <span className="flex flex-wrap justify-center space-x-5 ">
                      <span className="pr-6 text-xl font-bold text-black lg:text-3xl">
                        Deposit Crypto
                      </span>
                    </span>
                    <span className="flex flex-wrap items-center justify-center space-x-5">
                      <span className="mt-4 mb-3 justify-center text-center font-sans text-base font-semibold not-italic leading-5 text-[#111111]">
                        Start Mixing
                      </span>
                    </span>
                  </div>

                  <div className="font-bold drop-shadow-xl">
                    <div className={style.info}>
                      <div className={style.infoLeft}>
                        <div className="mt-4 mb-2 ml-5 text-sm font-bold text-[#000000]">
                          Choose Cryptocurrency:
                        </div>
                      </div>
                    </div>
                    <select
                      className={style.dropDown}
                      required
                      onChange={async (e) => {
                        const selectedValue = Number(e.target.value);
                        let token: TokenInfo | undefined;
                        if (selectedValue) {
                          token = availableTokens[Number(selectedValue)];
                          setSelectedOption(token.name);
                          setTokenAddr(token.address);
                          setTokenSym(token.symbol);
                          checkAllowance(token.address);
                          if (
                            token.address === "null" &&
                            token.name === "BNB"
                          ) {
                            setTokenMin("0.3");
                          } else if (
                            token.address ===
                              "0x55d398326f99059ff775485246999027b3197955" ||
                            token.address ===
                              "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                          ) {
                            setTokenMin("100");
                          }
                        }
                        //await loadBalance(token);
                      }}
                    >
                      {availableTokens?.map(
                        (token: TokenInfo, index: number) => (
                          <option
                            className={style.option}
                            value={index}
                            key={token.address}
                          >
                            {token.name}
                          </option>
                        )
                      )}
                    </select>
                    <div className={style.info}>
                      <div className={style.infoLeft}>
                        <div className="mt-4 mb-2 ml-5 text-sm font-bold text-[#000000]">
                          Choose Wallet Type:
                        </div>
                      </div>
                    </div>
                    <select
                      className={style.dropDown}
                      required
                      onChange={async (e) => {
                        const selectedValue = Number(e.target.value);
                        let wallet: WalletInfo | undefined;
                        if (selectedValue) {
                          wallet = availableWalletType[Number(selectedValue)];
                          setSelectedWallet(wallet.type);
                          wallet.type === "Peer to Peer (P2P) Wallet"
                            ? setWithdrawPanel(true)
                            : setWithdrawPanel(false);
                        }
                        //await loadBalance(token);
                      }}
                    >
                      {availableWalletType?.map(
                        (wallet: WalletInfo, index: number) => (
                          <option
                            className={style.option}
                            value={index}
                            key={wallet.type}
                          >
                            {wallet.type}
                          </option>
                        )
                      )}
                    </select>
                    {/* <div className={style.info}>
                        <div className={style.infoLeft}>
                          <div className="text-sm font-normal text-[#000000] ">
                            <span className="label-rm">Balance:</span>
                            {balanceToken}
                          </div>
                        </div>
                      </div> */}
                    <div className={style.info}>
                      <div className={style.infoLeft}>
                        <div className="mt-4 text-sm font-bold text-[#000000]">
                          Transfer To:
                        </div>
                      </div>
                    </div>
                    <div className={style.searchBar}>
                      <input
                        type="text"
                        className={style.searchInput}
                        placeholder=""
                        required
                        value={formInput.target}
                        onChange={(e) =>
                          updateFormInput((formInput) => ({
                            ...formInput,
                            target: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className={style.info}>
                      <div className={style.infoLeft}>
                        <div className="mt-4 text-sm font-bold text-[#000000]">
                          Amount To Transfer:
                        </div>
                      </div>
                    </div>
                    <div className={style.searchBar}>
                      {/* <InputIcon
                          className="input-icon"
                          Icon={FaMoneyBillWave}
                        /> */}
                      <input
                        type="number"
                        className={style.searchInput}
                        placeholder="Minimum deposit - 0.3 BNB / 100 USDT / 100 BUSD"
                        value={formInput.amount ? formInput.amount : ""}
                        min={tokenMin}
                        step="0.01"
                        required
                        onChange={(e) =>
                          updateFormInput((formInput) => ({
                            ...formInput,
                            amount: Number(e.target.value),
                          }))
                        }
                      />
                      <button
                        type="button"
                        onClick={(_) =>
                          updateFormInput((formInput) => ({
                            ...formInput,
                            amount: 0.0,
                          }))
                        }
                      >
                        {/* <InputIcon
                          className="input-icon mr-8"
                          Icon={FaBackspace}
                        /> */}
                      </button>
                    </div>

                    {loadingState === true ? (
                      <div>
                        <ClipLoader color="#000000" size={15} />
                        Connecting to blockchain. Please wait
                      </div>
                    ) : allowed === true ? (
                      <button
                        type="submit"
                        onClick={transfer}
                        className={style.nftButton}
                      >
                        Deposit
                      </button>
                    ) : (
                      <button
                        type="submit"
                        onClick={approve}
                        className={style.nftButton}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </>
              </div>
            </div>
            {withdrawPanel && (
              <div className={style.glowDivBox}>
                <div className="relative m-0 mt-3 h-[full] w-[95%] justify-center rounded-lg bg-lime-100 px-7 py-9 text-center leading-none md:ml-5 lg:w-full">
                  <>
                    <div className={style.details}>
                      <span className="flex flex-wrap justify-center space-x-5">
                        <span className="pr-6 text-xl font-bold text-black lg:text-3xl">
                          Withdraw Crypto
                        </span>
                      </span>
                      <span className="flex flex-wrap items-center justify-center space-x-5">
                        <span className="mt-4 mb-3 justify-center text-center font-sans text-base font-semibold not-italic leading-5 text-[#111111]">
                          Withdraw your funds to your wallet
                        </span>
                      </span>
                    </div>

                    <div className="font-bold drop-shadow-xl">
                      <div className={style.info}>
                        <div className={style.infoLeft}>
                          <div className="mt-4 mb-2 ml-20 text-sm font-bold text-[#000000]">
                            Choose Cryptocurrency:
                          </div>
                        </div>
                      </div>
                      <select
                        className={style.dropDownCrypto}
                        onChange={async (e) => {
                          const selectedValue = Number(e.target.value);
                          let token: TokenInfo | undefined;
                          if (selectedValue) {
                            token = availableTokens[Number(selectedValue)];
                            setSelectedOption(token.name);
                            setTokenAddr(token.address);
                          }
                          //await loadBalance(token);
                        }}
                      >
                        {availableTokens?.map(
                          (token: TokenInfo, index: number) => (
                            <option
                              className={style.option}
                              value={index}
                              key={token.address}
                            >
                              {token.name}
                            </option>
                          )
                        )}
                      </select>

                      {loadingState === true ? (
                        <div>
                          <ClipLoader color="#000000" size={15} />
                          Connecting to blockchain. Please wait
                        </div>
                      ) : (
                        <>
                          <button
                            type="submit"
                            onClick={getMyBalance}
                            className={style.nftButton}
                          >
                            Check Balance
                          </button>
                          <button
                            type="submit"
                            onClick={withdraw}
                            className={style.nftButton}
                          >
                            Withdraw
                          </button>
                        </>
                      )}
                    </div>
                  </>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pay;
