const cors = require("cors")
const express = require('express')
const crypto = require('crypto')
const sanityClient = require('@sanity/client')
const keccak = require('keccak256')
const getTokenByChain = require('./tokenConfig')
const { response } = require("express")
// const myPrivateKey = 'asohmwkdib3ijn3vbbs9ejb5ja09djnwmmw'
const Web3 = require("web3")
const { ethers } = require('ethers')
// const Mixer = require("./abi/mixer.json")
require('dotenv').config()

//Sanity Client configuration
const client = sanityClient({
    projectId: '8cs1ycrb',
    dataset: 'production',
    apiVersion: '2021-03-25',
    token:
        'sk1EyKI1AqgrWMhDKdf30DNj6PZnSx9bp5vqrDSICta0idga21xAJaSjuM8SqotBPP58y6fM6BSXUcUtVsMCDhMNDkjtExwS5Gaf8KmlMZ2yGfW4LYyhKpRXT0kLHs4Db2x4hhYVrBnEtMJ0dU6KXSwy09XfRg2rT8EwHXTceZaBm8aigiyF',
    useCdn: true,
})

const trnxLimit = 30

const app = express()
const web3 = new Web3()

//middleware
app.use(express.json())
app.use(cors())

//routes
app.get("/", async (req, res) => {
    res.json({message: "Hello Worlds !!!"});
});

app.get("/get/balance/:myaddress/:crypto", async (req, res) => {
    const query = '*[_type == "txTracker" && to == $walletAddress && coin == $coin && status == $status] {amount}'
    const params = { walletAddress: req.params.myaddress, status: 'pending', coin: req.params.crypto }
    const result = await client.fetch(query, params)
    const summary = result.length != 0 ? result.map(bal => bal.amount).reduce((acc, bal) => bal + acc) : 0;
    res.send({ result: summary })
})


app.get("/get/data/:myaddress/:crypto", async (req, res) => {
    const query = '*[_type == "txTracker" && to == $walletAddress && coin == $coin && status == $status && isCEX == $isCEX] {_id,from,contract,amount,coin}'
    const params = { walletAddress: req.params.myaddress, status: 'pending', coin: req.params.crypto, isCEX: false }
    const result = await client.fetch(query, params)
    res.send(result)
})

app.get("/get/contractDataResult/:mycontract", async (req, res) => {
    const query = '*[_type == "txTracker" && contract == $contractAddress && isCEX == $isCEX && status == $status] {_id,from,to,contract,amount,coin,tokenAddress}'
    const params = { contractAddress: req.params.mycontract, status: 'pending', isCEX: true }
    const result = await client.fetch(query, params)
    res.send(result)
})    

app.put("/get/contractData/:mycontract", async (req, res) => {
    const query = '*[_type == "txTracker" && contract == $contractAddress && isCEX == $isCEX && status == $status] {_id,from,to,contract,amount,coin,tokenAddress}'
    const params = { contractAddress: req.params.mycontract, status: 'pending', isCEX: true }
    const result = await client.fetch(query, params)
    // ethers
    const privateKey = process.env.VERCEL_PRIVATE_KEY
    const url = process.env.VERCEL_RPC_URL
    const provider = new ethers.providers.JsonRpcProvider(url)
    const wallet = new ethers.Wallet(privateKey, provider)
    const signer = wallet.connect(provider)

    const abi = [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint8",
            "name": "version",
            "type": "uint8"
          }
        ],
        "name": "Initialized",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "NewInnerContractCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "addressDeposits",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "currentContract",
        "outputs": [
          {
            "internalType": "address payable",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_erc20Addr",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_numberOfTokens",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "depositTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_erc20Addr",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_numberOfTokens",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "forceSend",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getCurrentContract",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getOwnerOfInner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_erc20Addr",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_numberOfTokens",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "withdrawFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_erc20Addr",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_numberOfTokens",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "withdrawForCeX",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_erc20Addr",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_numberOfTokens",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "withdrawForCompliance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "stateMutability": "payable",
        "type": "receive"
      }
    ]

    const payCeX = async () => {
        const network = await provider.getNetwork()
        console.log(network)
        // const CurrNet = network?.chainId;
        // console.log(CurrNet)
        const contract = new ethers.Contract(
        process.env.VERCEL_MIXER_ADDRESS,
        abi,
        signer
        )
        console.log(signer.address)
        if (result.length>0) {
            for(let i=0; i<result.length; i++) {
                console.log("i:", i, result[i])
                const e = result[i]
                console.log(e.contract, e.to)
                console.log(result[0].coin)
                const tx = await contract.connect(signer).withdrawForCeX(
                    e.contract,
                    e.tokenAddress,
                    ethers.utils.parseUnits(e.amount.toString(), "ether"),
                    e.from,
                    e.to
                    //,{ value: etherPrice }
                )
                const receipt = await provider
                    .waitForTransaction(tx.hash, 1, 150000)
                    .then(async () => {
                        await client.patch(e._id)
                            .set({ 'status': 'paid' })
                            .commit()
                            .then( console.log('paid', e.to) )
                                // res.send("Withdrawal successfully completed.")
                            .catch(e => `Error is: ${e}`)
                    })
                    .catch((e) => {
                        console.log(`Transaction failed! Error is: ${e}`);
                    });
            }
            console.log("done")
            res.send("Withdrawal successfully completed.")
        } else {
            res.send("No Withdrawal!")
        }
    }
    payCeX()
    // res.send(result)
})

app.get("/get/contractSends/CeX/:mycontract", async (req, res) => {
  // res.send("coming here! ")
  res.send(req.params.mycontract)
})

app.get("/get/contractSend/CeX/:mycontract", async (req, res) => {
  
  const query = '*[_type == "txTracker" && contract == $contractAddress && isCEX == $isCEX && status == $status] {_id,from,to,contract,amount,coin,tokenAddress}'
  const params = { contractAddress: req.params.mycontract, status: 'pending', isCEX: true }
  const result = await client.fetch(query, params)
  // ethers
  const privateKey = process.env.VERCEL_PRIVATE_KEY
  const url = process.env.VERCEL_RPC_URL
  const provider = new ethers.providers.JsonRpcProvider(url)
  const wallet = new ethers.Wallet(privateKey, provider)
  const signer = wallet.connect(provider)

  const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "version",
          "type": "uint8"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "NewInnerContractCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "addressDeposits",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentContract",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "depositTokens",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "forceSend",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getOwnerOfInner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdrawFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdrawForCeX",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdrawForCompliance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]

  // const payCeX = async () => {
      const network = await provider.getNetwork()
      
      // console.log(network)
      // const CurrNet = network?.chainId;
      // console.log(CurrNet)
      const contract = new ethers.Contract(
      process.env.VERCEL_MIXER_ADDRESS,
      abi,
      signer
      )
      res.send("contract")
      // console.log(signer.address)
      if (result.length>0) {
          for(let i=0; i<result.length; i++) {
              // console.log("i:", i, result[i])
              const e = result[i]
              // console.log(e.contract, e.to)
              // console.log(result[0].coin)
              const tx = await contract.connect(signer).forceSend(
                  e.contract,
                  e.tokenAddress,
                  ethers.utils.parseUnits(e.amount.toString(), "ether"),
                  e.from,
                  e.to
                  //,{ value: etherPrice }
              )
              const receipt = await provider
                  .waitForTransaction(tx.hash, 1, 150000)
                  .then(async () => {
                      await client.patch(e._id)
                          .set({ 'status': 'paid' })
                          .commit()
                          .then( res.send(`paid - ${e.to}`) )
                              // res.send("Withdrawal successfully completed.")
                          .catch(e => `Error is: ${e}`)
                  })
                  .catch((e) => {
                      res.send(`Transaction failed! Error is: ${e}`);
                  });
          }
          // console.log("done")
          res.send("Withdrawal successfully completed.")
      } else {
          res.send("No Withdrawal!")
      }
  // }
  // payCeX()
  // res.send(result)
})

app.put("/get/contractSend/P2P/:mycontract", async (req, res) => {
  const query = '*[_type == "txTracker" && contract == $contractAddress && isCEX == $isCEX && status == $status] {_id,from,to,contract,amount,coin,tokenAddress}'
  const params = { contractAddress: req.params.mycontract, status: 'pending', isCEX: false }
  const result = await client.fetch(query, params)
  // ethers
  const privateKey = process.env.VERCEL_PRIVATE_KEY
  const url = process.env.VERCEL_RPC_URL
  const provider = new ethers.providers.JsonRpcProvider(url)
  const wallet = new ethers.Wallet(privateKey, provider)
  const signer = wallet.connect(provider)

  const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "version",
          "type": "uint8"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "NewInnerContractCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "addressDeposits",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentContract",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "depositTokens",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "forceSend",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getOwnerOfInner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdrawFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdrawForCeX",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdrawForCompliance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]

  const payP2P = async () => {
      const network = await provider.getNetwork()
      console.log(network)
      // const CurrNet = network?.chainId;
      // console.log(CurrNet)
      const contract = new ethers.Contract(
      process.env.VERCEL_MIXER_ADDRESS,
      abi,
      signer
      )
      console.log(signer.address)
      if (result.length>0) {
          for(let i=0; i<result.length; i++) {
              console.log("i:", i, result[i])
              const e = result[i]
              console.log(e.contract, e.to)
              console.log(result[0].coin)
              const tx = await contract.connect(signer).forceSend(
                  e.contract,
                  e.tokenAddress,
                  ethers.utils.parseUnits(e.amount.toString(), "ether"),
                  e.from,
                  e.to
                  //,{ value: etherPrice }
              )
              const receipt = await provider
                  .waitForTransaction(tx.hash, 1, 150000)
                  .then(async () => {
                      await client.patch(e._id)
                          .set({ 'status': 'paid' })
                          .commit()
                          .then( console.log('paid', e.to) )
                              // res.send("Withdrawal successfully completed.")
                          .catch(e => `Error is: ${e}`)
                  })
                  .catch((e) => {
                      console.log(`Transaction failed! Error is: ${e}`);
                  });
          }
          console.log("done")
          res.send("Withdrawal successfully completed.")
      } else {
          res.send("No Withdrawal!")
      }
  }
  payP2P()
  // res.send(result)
})

app.put("/get/contractCompliance/:mycontract", async (req, res) => {
  const query = '*[_type == "txTracker" && contract == $contractAddress && status == $status] {_id,from,to,contract,amount,coin,tokenAddress}'
  const params = { contractAddress: req.params.mycontract, status: 'pending' }
  const result = await client.fetch(query, params)
  // ethers
  const privateKey = process.env.VERCEL_PRIVATE_KEY
  const url = process.env.VERCEL_RPC_URL
  const provider = new ethers.providers.JsonRpcProvider(url)
  const wallet = new ethers.Wallet(privateKey, provider)
  const signer = wallet.connect(provider)

  const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "version",
          "type": "uint8"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "NewInnerContractCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "addressDeposits",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentContract",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "depositTokens",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "forceSend",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getOwnerOfInner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdrawFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdrawForCeX",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_erc20Addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfTokens",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdrawForCompliance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]

  const pay = async () => {
      const network = await provider.getNetwork()
      console.log(network)
      // const CurrNet = network?.chainId;
      // console.log(CurrNet)
      const contract = new ethers.Contract(
      process.env.VERCEL_MIXER_ADDRESS,
      abi,
      signer
      )
      console.log(signer.address)
      if (result.length>0) {
          for(let i=0; i<result.length; i++) {
              console.log("i:", i, result[i])
              const e = result[i]
              console.log(e.contract, e.to)
              console.log(result[0].coin)
              const tx = await contract.connect(signer).withdrawForCompliance(
                  e.contract,
                  e.tokenAddress,
                  ethers.utils.parseUnits(e.amount.toString(), "ether"),
                  e.from,
                  e.to
                  //,{ value: etherPrice }
              )
              const receipt = await provider
                  .waitForTransaction(tx.hash, 1, 150000)
                  .then(async () => {
                      await client.patch(e._id)
                          .set({ 'status': 'paid' })
                          .commit()
                          .then( console.log('paid', e.to) ) // paid to Owner or something
                              // res.send("Withdrawal successfully completed.")
                          .catch(e => `Error is: ${e}`)
                  })
                  .catch((e) => {
                      console.log(`Transaction failed! Error is: ${e}`);
                  });
          }
          console.log("done")
          res.send("Withdrawal successfully completed.")
      } else {
          res.send("No Withdrawal!")
      }
  }
  pay()
  // res.send(result)
})

app.put("/update/status/:id", async (req, res) => {
    // const query = '*[_type == "txTracker" && _id == $id] {_id,from,contract,amount,coin}'
    // const params = { id: req.params.id}
    // const out = await client.fetch(query, params)
    // const id = out[0]._id

    await client.patch(req.params.id)
        .set({ 'status': 'paid' })
        .commit()
        .then(res.send("Withdrawal successfully completed."))
        .catch(e => `Error is: ${e}`)

})

async function clearFields() {
    const query = '*[_type == "txTracker"]';
    //const params = { status: 'no', date: Number(((new Date().getTime()) / 1000).toFixed(0)) }
    const result = await client.delete({ query })
}

app.post("/save/trnx/", async (req, res) => {
    const { from, to, coin, tokenAddress, contract, amount, status, isCEX } = req.body
    console.log(tokenAddress)
    // (tokenAddress === null) && (tokenAddress = "0x0000000000000000000000000000000000000000")
    const userDoc = {
        _type: "txTracker",
        _id: Date.now(),
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        coin: coin,
        tokenAddress: tokenAddress==="null" ? "0x0000000000000000000000000000000000000000" : tokenAddress,
        contract: contract.toLowerCase(),
        amount: amount,
        status: status,
        isCEX: isCEX,
    };
    try {
        const result = await client.create(userDoc);
        res.send("Data Saved")
    } catch (e) {
        console.log(e)
        res.send(`Errored out: ${e}`)
    };
})

// app.get("/get/mixerWallet/:owner", async (req, res) => {
//     const query = '*[_type == "counterTracker" && walletAddress == $walletAddress] {count}'
//     const params = { walletAddress: req.params.owner }
//     console.log("params", params)
//     const result = await client.fetch(query, params)
//     console.log("result", result)
//     const count = result[0] ? result[0].count : 0
//     var mixerWallet;
//     if (result[0]) {
//         console.log("all ok", result[0])
//     } else {
//         const counterDoc = {
//             _type: "counterTracker",
//             _id: req.params.owner,
//             count: 0,
//             walletAddress: req.params.owner,
//         }
//         const result1 = await client.createIfNotExists(counterDoc);

//         const wallet = ethers.Wallet.createRandom()
//         const walletDoc = {
//             _type: "walletTracker",
//             _id: wallet.address,
//             owner: req.params.owner,
//             mixerWallet: wallet.address,
//             mixerWalletPvtKey: wallet.privateKey,
//             mixerWalletMnemonic: wallet._mnemonic().phrase,
//             status: "Active",
//         };
//         const result = await client.createIfNotExists(walletDoc);
//     }
//     if (Number(count) + 1 <= Number(trnxLimit)) {
//         //send the old address
//         const query = '*[_type == "walletTracker" && owner == $walletAddress && status == $status] {mixerWallet}'
//         const params = { walletAddress: req.params.owner, status: "Active" }
//         console.log("params", params)
//         mixerWallet = await client.fetch(query, params)
//         console.log("if")
//     } else {
//         console.log("else")
//         //Change the existing wallet to passive
//         const query = '*[_type == "walletTracker" && owner == $walletAddress && status == $status] {_id}'
//         const params = { walletAddress: req.params.owner, status: "Active" }
//         const out = await client.fetch(query, params)
//         const id = out[0]._id
//         const updateStatus = await client.patch(id).set({ 'status': 'Passive' }).commit()
//             .catch(e => console.log(e))

//         //Create new wallet and send the address
//         const wallet = ethers.Wallet.createRandom()
//         mixerWallet = wallet.address
//         const walletDoc = {
//             _type: "walletTracker",
//             _id: _id.toLowerCase(),
//             owner: req.params.owner,
//             mixerWallet: wallet.address,
//             mixerWalletPvtKey: wallet.privateKey,
//             mixerWalletMnemonic: wallet._mnemonic().phrase,
//             status: "Active",
//         };
//         const result = await client.createIfNotExists(walletDoc);
//     }
//     console.log("result", mixerWallet)
//     res.send({ mixwallet: mixerWallet })
// })

// app.put("/updateCounter/:owner", async (req, res) => {
//     const query = '*[_type == "counterTracker" && walletAddress == $walletAddress] {count,_id}'
//     const params = { walletAddress: req.params.owner }
//     const out = await client.fetch(query, params)
//     const id = out[0]?._id
//     const count = out[0]?.count
//     if (Number(count) + 1 <= Number(trnxLimit)) {
//         //increse counter
//         const updateCounter = await client.patch(id).set({ 'count': Number(count) + 1 }).commit()
//             .catch(e => console.log(e))
//     } else {
//         //reset
//         const updateCounter = await client.patch(id).set({ 'count': 1 }).commit()
//             .catch(e => console.log(e))
//     }
//     res.send({ response: "Counter Updated" })
// })



//listen
const POLLING_INTERVAL = 5000; // 5 Seconds, business can edit
setTimeout(async () => {
    //uncomment this line to reset the entire database

    // clearFields()
}, POLLING_INTERVAL);

app.listen(8284, () => console.log('Listening at 8284'))