const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying MetaFight contract with the account:", deployer.address);

  const MetaFight = await hre.ethers.getContractFactory("MetaFight");
  const metafight = await MetaFight.deploy("MetaFightToken", "MFT", "ipfs://QmcXnQK9GKqXE9X8kkGe7Sb5G9rBAAPw6oxeA4CrjdQmCu/");
  console.log('Deploying Contract')
  await metafight.deployed();

  console.log("MetaFight contract deployed to:", metafight.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
