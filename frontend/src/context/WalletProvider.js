import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletContext from './WalletContext';

const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUserId, setConnectedUserId] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          let provider = new ethers.providers(window.ethereum);
          const signer = provider.getSigner();
          const account = await signer.getAddress();
          if (account) {
            setIsConnected(true);
            setConnectedUserId(account);
          }
        } catch (error) {
          console.error("An error occurred while fetching the account: ", error);
        }
      }
    };
    
    //checkConnection();
    //Does Check Connection pause an issue for me ?
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setIsConnected(true);
          setConnectedUserId(accounts[0]);
        } else {
          setIsConnected(false);
          setConnectedUserId('');
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        if (!window.ethereum.selectedAddress) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        let provider = new ethers.providers(window.ethereum)
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        setIsConnected(true);
        setConnectedUserId(account);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask or another Ethereum wallet provider.');
    }
  };
/* Adding disconnect option
  const disconnectWallet = () => {
    if (window.ethereum) {
    try {
      window.ethereum.request({ method: 'wallet_requestPermissions' });
  */

  return (
    <WalletContext.Provider value={{ isConnected, connectedUserId, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
