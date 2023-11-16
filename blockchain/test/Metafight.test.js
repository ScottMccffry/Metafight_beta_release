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
    it('Should mint an NFT', async function () {
      const nftPrice = ethers.utils.parseEther('0.1');
      const metadataURI = "ipfs://example";
      const pendingId = 1; // Example pending ID
  
      await expect(metafight.connect(addr1).mint(nftPrice, metadataURI, pendingId, { value: nftPrice }))
        .to.emit(metafight, 'MintConfirmed')
        .withArgs(1, addr1.address, pendingId); // Assuming the first token ID is 1
  
      expect(await metafight.ownerOf(1)).to.equal(addr1.address);
      expect(await metafight.tokenURI(1)).to.equal("https://ipfs.io/ipfs/" + metadataURI);
    });

    it('Should set correct token URI on mint', async function () {
      const nftPrice = ethers.utils.parseEther('0.1');
      const metadataURI = "ipfs://example";
      const pendingId = 1; // Example pending ID
  
      await metafight.connect(addr1).mint(nftPrice, metadataURI, pendingId, { value: nftPrice });
      expect(await metafight.tokenURI(1)).to.equal("https://ipfs.io/ipfs/" + metadataURI);
    });

    it('Should revert if contract is paused', async function () {
      const nftPrice = ethers.utils.parseEther('0.1');
      const metadataURI = "ipfs://example";
      const pendingId = 1; // Example pending ID
      await metafight.pause();
      await expect(metafight.connect(addr1).mint(nftPrice, metadataURI, pendingId, { value: nftPrice })).to.be.revertedWith('the contract is paused');
    });
  });

  describe('Base URI', function () {
    it('Should return correct base URI', async function () {
      expect(await metafight._baseURI()).to.equal("https://example.com/token/");
    });
  });

  describe('Wallet Ownership', function () {
    it('Should return list of NFTs owned by an address', async function () {
      const nftPrice = ethers.utils.parseEther('0.1');
      const metadataURI = "ipfs://example";
      const pendingId = 1; // Example pending ID
      await metafight.connect(addr1).mint(nftPrice, metadataURI, 1, { value: nftPrice });
      await metafight.connect(addr1).mint(nftPrice, metadataURI, 2, { value: nftPrice });
      expect(await metafight.walletOfOwner(addr1.address)).to.deep.equal([1, 2]);
    });
  });
});
