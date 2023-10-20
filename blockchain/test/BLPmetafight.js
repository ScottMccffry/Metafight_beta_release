// Importing required modules and tools
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('BLPmetafight', function () {
  let BLPmetafight, blpmetafight, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploying the contract
    BLPmetafight = await ethers.getContractFactory('BLPmetafight');
    [owner, addr1, addr2, _] = await ethers.getSigners();
    blpmetafight = await BLPmetafight.deploy();
    await blpmetafight.deployed();
  });

  describe('Deposit', function () {
    it('Should deposit ether and update balance', async function () {
      await blpmetafight.connect(addr1).deposit({ value: ethers.utils.parseEther('1') });
      expect(await blpmetafight.balances(addr1.address)).to.equal(ethers.utils.parseEther('1'));
    });

    it('Should emit Deposit event on deposit', async function () {
      await expect(blpmetafight.connect(addr1).deposit({ value: ethers.utils.parseEther('1') }))
        .to.emit(blpmetafight, 'Deposit')
        .withArgs(addr1.address, ethers.utils.parseEther('1'));
    });
  });

  describe('Withdraw', function () {
    it('Should withdraw ether and update balance', async function () {
      await blpmetafight.connect(addr1).deposit({ value: ethers.utils.parseEther('1') });
      await blpmetafight.connect(addr1).withdraw(ethers.utils.parseEther('0.5'));
      expect(await blpmetafight.balances(addr1.address)).to.equal(ethers.utils.parseEther('0.5'));
    });

    it('Should revert if trying to withdraw more than balance', async function () {
      await blpmetafight.connect(addr1).deposit({ value: ethers.utils.parseEther('1') });
      await expect(blpmetafight.connect(addr1).withdraw(ethers.utils.parseEther('1.5'))).to.be.revertedWith('Insufficient balance');
    });

    it('Should revert if trying to withdraw with no balance', async function () {
      await expect(blpmetafight.connect(addr1).withdraw(ethers.utils.parseEther('1'))).to.be.revertedWith('Insufficient balance');
    });
  });
});
