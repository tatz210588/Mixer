const { ethers, upgrades } = require("hardhat")

async function main() {
    const mixer = await ethers.getContractFactory("Mixer");
    let proxy = await upgrades.upgradeProxy("0x03B4b9d8B987D062817Ff23867F3c3e832eAF9C5", mixer); //bsc-testnet
    console.log("Mixer Contract has been successfully upgraded...")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
