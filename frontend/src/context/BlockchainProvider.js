import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import BlockchainContext from './BlockchainContext.js'

export const BlockchainProvider = ({ children }) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      process.env.REACT_APP_CONTRACT_ABI,
      process.env.REACT_STAKE_CONTRACT_ADDRESS,
      process.env.REACT_STAKE_CONTRACT_ABI,
      signer
    );
  
    useEffect(() => {
        // Listen for contract events
        contract.on('MintConfirmed', (tokenId, owner) => {
          // Handle mint confirmation
          console.log(`Mint was confirmed for token ID: ${tokenId} and owner: ${owner}`);
        });
    
        // Cleanup the event listener when the component unmounts
        return () => {
          contract.removeAllListeners('MintConfirmed');
        };
      }, [contract]);
    
    
async function stakeNFT(nft_address) {
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
async function mintNFT(price, metadataUrl, overrides) {
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
  const transaction = await contract.mint(price,metadataUrl,overrides );
  const receipt = await transaction.wait();

  // Return transaction details or receipt
  return receipt;
}

    return (
      <BlockchainContext.Provider value={{ mintNFT, stakeNFT }}>
        {children}
      </BlockchainContext.Provider>
    );
  };