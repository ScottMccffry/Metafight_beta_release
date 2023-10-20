const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying NFTStaking contract with the account:", deployer.address);

  // Assuming a basic ERC721 contract is available and is deployed first
  const BasicERC721 = await hre.ethers.getContractFactory("BasicERC721");
  const basicERC721 = await BasicERC721.deploy("BasicNFT", "BNFT");
  await basicERC721.deployed();
  console.log("BasicERC721 contract deployed to:", basicERC721.address);

  // Deploying the NFTStaking contract using the address of the deployed ERC721 as an argument
  const NFTStaking = await hre.ethers.getContractFactory("NFTStaking");
  const nftstaking = await NFTStaking.deploy(basicERC721.address);

  await nftstaking.deployed();

  console.log("NFTStaking contract deployed to:", nftstaking.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
