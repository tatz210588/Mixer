const { ethers, upgrades } = require("hardhat")

async function main() {
    const mixer = await ethers.getContractFactory("Mixer");
    let proxy = await upgrades.upgradeProxy("0x179823c5C74463DfffB28B42b400cd1cA6466DAd", mixer); //bsc-testnet
    console.log("Mixer Contract has been successfully upgraded...")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
