import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import UnifiedContext from './UnifiedContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000' ;

const UnifiedProvider = ({ children }) => {
  // Authentication related states
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('user'));
  const [userId, setUserId] = useState('');

  // Wallet related states
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUserId, setConnectedUserId] = useState('');

  // Authentication related functions
  const loginUser = async (email, password) => {
    console.log("This is a message");
    try {
      

      const response = await axios.post(`${API_BASE_URL}/api/users/login`, { email, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsAuthenticated(true);
      setUserId(response.data.userId);
      return response.data.userId;
    } catch (error) {
      console.error('Error during login:', error.message);
      throw new Error('Failed to login. Please check your credentials.');
    }
  };

  const logoutUser = () => {
    axios.post(`${API_BASE_URL}/api/users/logout`);
    setIsAuthenticated(false);
    setUserId('');
  };

  // Wallet related functions

    useEffect(() => {
        const checkConnection = async () => {
          if (typeof window.ethereum !== 'undefined') {
            try {
              let provider = new ethers.BrowserProvider(window.ethereum);
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
        
        checkConnection();
    
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
          let provider = new ethers.BrowserProvider(window.ethereum)
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

  return (
    <UnifiedContext.Provider value={{ isAuthenticated, userId, loginUser, logoutUser, isConnected, connectedUserId, connectWallet }}>
      {children}
    </UnifiedContext.Provider>
  );
};

export default UnifiedProvider;
