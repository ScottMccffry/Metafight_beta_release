import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import BlockchainContext from './BlockchainContext.js'
import metaFightAbi from '../contracts/MetaFight.json'; // MetaFight ABI
//import stakeAbi from '../contracts/Stake.json'; // Stake ABI
//import poolAbi from '../contracts/Pool.json'; // Pool ABI
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const BlockchainProvider = ({ children }) => {
    //const provider = new ethers.BrowserProvider(window.ethereum);
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");

    const signer = provider.getSigner();
    console.log("Contract Address:", process.env.REACT_APP_NFT_CONTRACT_ADDRESS);
    console.log("ABI:", metaFightAbi.abi);
    // Mint Contract
    const mintContract = new ethers.Contract(
      process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
      metaFightAbi.abi,
      provider
    );
    {/*
    // Stake Contract
    const stakeContract = new ethers.Contract(
      process.env.REACT_APP_STAKE_CONTRACT_ADDRESS,
      stakeAbi.abi,
      signer
    );

    // Pool Contract
    const poolContract = new ethers.Contract(
      process.env.REACT_APP_POOL_CONTRACT_ADDRESS,
      poolAbi.abi,
      signer
    );
     */}
  //event listener for transaction confirmation
  
    useEffect(() => {
      // Listen for mint confirmation events
      mintContract.on('MintConfirmed', (tokenId, owner, pending_id, event) => {
        console.log(`Mint was confirmed for token ID: ${tokenId} and owner: ${owner} and pending ID: ${pending_id} `);
        const confirmMint = async () => {
          try {
          
            const serializedTokenId = tokenId.toString();
            const serializedOwnerId = owner.toString(); // Assuming owner is a BigInt
            const serializedPendingId = pending_id.toString(); // Assuming pending_id is a BigInt
        
            // Replace with your actual API endpoint
            const response = await axios.post(`${API_BASE_URL}/api/mint_confirm/`, {
              owner: serializedOwnerId,
              pending_id: serializedPendingId
            });
          } catch (error) {
            console.error('Error sending characteristics:', error);
            throw new Error('Failed to send characteristics to server');
          }
        };
        confirmMint();
      });
  {/*
      // Listen for stake confirmation events
      stakeContract.on('StakeConfirmed', (tokenId, staker) => {
        console.log(`Stake was confirmed for token ID: ${tokenId} and staker: ${staker}`);
        // Here you can make an API call to your backend to update the staking status
      });
  */}
      // Cleanup the event listeners when the component unmounts
      return () => {
        mintContract.removeAllListeners('MintConfirmed');
        //stakeContract.removeAllListeners('StakeConfirmed');
      };
    }, [mintContract]); //  stakeContrac
 {/*
  async function stakeNFT(nft_address) {
        console.log("Stake NFT provider")
        if (typeof window.ethereum === 'undefined') {
          throw new Error('Ethereum wallet is not connected');
          }
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();
        const contract = stakeContract;
        
        // Assuming your contract has a stake method
        const transaction = await contract.stake(nft_address, { from: accounts[0] });
        const receipt = await transaction.wait();
        
          // Return receipt or transaction details
        return receipt;
        }
      */}

  
  const mintNFT = async (price, metadataUrl, pending_id, overrides) => {
    try {
      console.log("Mint NFT provider");

      if (typeof window.ethereum === 'undefined') {
        throw new Error('Ethereum wallet is not connected');
      }
      console.log("ok1")
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("ok2")

      //const provider = new ethers.BrowserProvider(window.ethereum);
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      console.log("ok3")

      const signer = await provider.getSigner();
      console.log("ok4")

      const contract = new ethers.Contract(
        process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
        metaFightAbi.abi,
        signer
      );
      console.log("ok5")
      const transaction = await contract.mint(price, metadataUrl, pending_id, overrides);
      console.log("ok6")
      const receipt = await transaction.wait();

      return receipt;
    } catch (error) {
      console.error("Error in mintNFT function:", error);
      throw error;  // Re-throwing the error to be handled by the caller
    }
  };

  const buyCredits = async () => {
    console.log("Buy Credits Provider");
    // Implement the buy credits logic here
  };

//stakeNFT,
//mintNFT, 
  return (
      <BlockchainContext.Provider value={{mintNFT, buyCredits }}>
        {children}
      </BlockchainContext.Provider>
  );
  };
  export default BlockchainProvider;