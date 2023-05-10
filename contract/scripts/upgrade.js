const { ethers, upgrades } = require("hardhat")

async function main() {
    const mixer = await ethers.getContractFactory("Mixer");
    let proxy = await upgrades.upgradeProxy("0xb7Bc26b77D846FbB7F46BD59703F746B7073CB6E", mixer); //bsc-testnet
    console.log("Mixer Contract has been successfully upgraded...")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
