const { expect } = require('chai');
const { ethers } = require('hardhat');
//assumption that there is a basic ERC721 contract named BasicERC721 available. This contract is used to mint NFTs for the staking tests.
describe('NFTStaking', function () {
  let NFT, nft, NFTStaking, nftstaking, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploying the NFT contract (assuming a basic ERC721 is available)
    NFT = await ethers.getContractFactory('BasicERC721');
    [owner, addr1, addr2, _] = await ethers.getSigners();
    nft = await NFT.deploy("BasicNFT", "BNFT");
    await nft.deployed();

    // Minting a sample NFT to addr1 for testing
    await nft.connect(owner).mint(addr1.address);

    // Deploying the NFTStaking contract
    NFTStaking = await ethers.getContractFactory('NFTStaking');
    nftstaking = await NFTStaking.deploy(nft.address);
    await nftstaking.deployed();
  });

  describe('Staking', function () {
    it('Should stake an NFT', async function () {
      await nft.connect(addr1).approve(nftstaking.address, 1);
      await nftstaking.connect(addr1).stakeNFT(1);
      expect(await nftstaking.stakingBalance(addr1.address)).to.equal(1);
    });

    it('Should emit Staked event on staking', async function () {
      await nft.connect(addr1).approve(nftstaking.address, 1);
      await expect(nftstaking.connect(addr1).stakeNFT(1))
        .to.emit(nftstaking, 'Staked')
        .withArgs(addr1.address, 1);
    });

    it('Should revert if trying to stake an NFT not owned by sender', async function () {
      await expect(nftstaking.connect(addr2).stakeNFT(1)).to.be.revertedWith('You do not own this token');
    });
  });

  describe('Unstaking', function () {
    it('Should unstake an NFT', async function () {
      await nft.connect(addr1).approve(nftstaking.address, 1);
      await nftstaking.connect(addr1).stakeNFT(1);
      await nftstaking.connect(addr1).unstakeNFT();
      expect(await nftstaking.stakingBalance(addr1.address)).to.equal(0);
      expect(await nft.ownerOf(1)).to.equal(addr1.address);
    });

    it('Should emit Unstaked event on unstaking', async function () {
      await nft.connect(addr1).approve(nftstaking.address, 1);
      await nftstaking.connect(addr1).stakeNFT(1);
      await expect(nftstaking.connect(addr1).unstakeNFT())
        .to.emit(nftstaking, 'Unstaked')
        .withArgs(addr1.address, 1);
    });

    it('Should revert if trying to unstake with no staked NFT', async function () {
      await expect(nftstaking.connect(addr1).unstakeNFT()).to.be.revertedWith('You do not stake any token');
    });
  });
});
