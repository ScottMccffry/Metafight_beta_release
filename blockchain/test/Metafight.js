const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MetaFight', function () {
  let MetaFight, metafight, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploying the contract
    MetaFight = await ethers.getContractFactory('MetaFight');
    [owner, addr1, addr2, _] = await ethers.getSigners();
    metafight = await MetaFight.deploy("MetaFightToken", "MFT", "https://example.com/token/");
    await metafight.deployed();
  });

  describe('Minting', function () {
    it('Should mint a new NFT for the sender', async function () {
      await metafight.connect(addr1).mint(ethers.utils.parseEther('0.1'));
      expect(await metafight.ownerOf(1)).to.equal(addr1.address);
    });

    it('Should set correct token URI on mint', async function () {
      await metafight.connect(addr1).mint(ethers.utils.parseEther('0.1'));
      expect(await metafight.tokenURI(1)).to.equal("https://example.com/token/1.json");
    });

    it('Should revert if contract is paused', async function () {
      await metafight.pause();
      await expect(metafight.connect(addr1).mint(ethers.utils.parseEther('0.1'))).to.be.revertedWith('the contract is paused');
    });
  });

  describe('Base URI', function () {
    it('Should return correct base URI', async function () {
      expect(await metafight._baseURI()).to.equal("https://example.com/token/");
    });
  });

  describe('Wallet Ownership', function () {
    it('Should return list of NFTs owned by an address', async function () {
      await metafight.connect(addr1).mint(ethers.utils.parseEther('0.1'));
      await metafight.connect(addr1).mint(ethers.utils.parseEther('0.1'));
      expect(await metafight.walletOfOwner(addr1.address)).to.deep.equal([1, 2]);
    });
  });
});
