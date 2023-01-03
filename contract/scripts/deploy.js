const hre = require("hardhat");

async function main() {

  const mixer = await hre.ethers.getContractFactory("Mixer");
  const mixerMain = await mixer.deploy();
  await mixerMain.deployed();
  console.log("Mixer deployed to:", mixerMain.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("This is error");
    console.error(error);
    process.exit(1);
  });
