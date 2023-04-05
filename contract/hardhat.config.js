require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('@openzeppelin/hardhat-upgrades')
require('@nomiclabs/hardhat-web3')

const infura_projectId = '403f2033226a44788c2638cc1c29d438'
const fs = require('fs')
const privateKey = fs.readFileSync('.secret').toString()

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey],
      chainId: 80001,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey],
      chainId: 5,
    },
    bsc_testnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [privateKey],
      chainId: 97,
    },
    bsc: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: [privateKey],
      chainId: 56,
    }
  },

  etherscan: {
    apiKey: '5PB2QWEDWRA9JBUWGBDHHZFM2X5YECC5Q2',
  },
  solidity: '0.8.7',
  paths: {
    artifacts: '../mixer-frontend/artifacts',
  },
}
