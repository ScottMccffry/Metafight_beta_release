import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import BlockchainContext from './BlockchainContext.js'

export const BlockchainProvider = ({ children }) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
  
  
    // Assuming you have separate contracts for minting and staking
    const mintContract = new ethers.Contract(
      process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
      process.env.REACT_APP_NFT_CONTRACT_ABI,
      signer
    );
  
    const stakeContract = new ethers.Contract(
      process.env.REACT_APP_STAKE_CONTRACT_ADDRESS,
      process.env.REACT_APP_STAKE_CONTRACT_ABI,
      signer
    );
    const poolContract = new ethers.Contract(
      process.env.REACT_APP_POOL_CONTRACT_ADDRESS,
      process.env.REACT_APP_POOL_CONTRACT_ABI,
      signer
    );
  //event listener for transaction confirmation
    useEffect(() => {
      // Listen for mint confirmation events
      mintContract.on('MintConfirmed', (tokenId, owner, pending_id, event) => {
        console.log(`Mint was confirmed for token ID: ${tokenId} and owner: ${owner} and pending ID: ${pending_id} `);
        const sendCharacteristicsToServer = async () => {
          try {
            // Replace with your actual API endpoint
            const response = await axios.post('/api/confirm-mint/', {owner, pending_id });
            console.log('mint confirmed');
          } catch (error) {
            console.error('Error sending characteristics:', error);
            throw new Error('Failed to send characteristics to server');
          }
        };

      });
  
      // Listen for stake confirmation events
      stakeContract.on('StakeConfirmed', (tokenId, staker) => {
        console.log(`Stake was confirmed for token ID: ${tokenId} and staker: ${staker}`);
        // Here you can make an API call to your backend to update the staking status
      });
  
      // Cleanup the event listeners when the component unmounts
      return () => {
        mintContract.removeAllListeners('MintConfirmed');
        stakeContract.removeAllListeners('StakeConfirmed');
      };
    }, [mintContract, stakeContract]);

  async function stakeNFT(nft_address) {
        console.log("Stake NFT provider")
        if (typeof window.ethereum === 'undefined') {
          throw new Error('Ethereum wallet is not connected');
          }
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(process.env.REACT_APP_STAKE_CONTRACT_ADDRESS, REACT_APP_STAKE_CONTRACT_ADDRESS, signer);
        
        // Assuming your contract has a stake method
        const transaction = await contract.stake(nft_address, { from: accounts[0] });
        const receipt = await transaction.wait();
        
          // Return receipt or transaction details
        return receipt;
        }
  // Helper function to mint NFT on blockchain
  async function mintNFT(price, metadataUrl, pending_id, overrides) {
    console.log("Mint NFT provider")
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Ethereum wallet is not connected');
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    //here MFT.abi necessary
    const contract = new ethers.Contract(process.env.REACT_APP_NFT_CONTRACT_ADDRESS, NFT_ABI, signer);

    // Here you would call the appropriate smart contract method to mint the NFT
    // Replace with your actual minting method parameters
    const transaction = await contract.mint(price, metadataUrl, pending_id ,overrides);
    const receipt = await transaction.wait();

    // Return transaction details or receipt
    return receipt;
  }

  async function buyCredits(){
    console.log("Buy Credits Provider")
  }

  return (
      <BlockchainContext.Provider value={{ mintNFT, stakeNFT, buyCredits }}>
        {children}
      </BlockchainContext.Provider>
  );
  };