import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import UnifiedContext from './UnifiedContext';
import ModalRegisterUsernamePassword from '../components/modalRegisterUsernamePassword/modalRegisterUsernamePassword';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UnifiedProvider = ({ children }) => {
  // Authentication related states
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('user'));
  const [userId, setUserId] = useState('');
  const [userAddress, setUserAddress]= useState('')
  const [username, setUsername]= useState('')

  // Wallet related states
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);


  // Authentication related functions
  const loginUser = async (email, password) => {
    console.log("This is a message");
    try {
      

      const response = await axios.post(`${API_BASE_URL}/api/user/login`, { email, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log("Server Response:", response.data); 
      setIsAuthenticated(true);
      setUserId(response.data.userId);
      setUserAddress(response.data.userAddress)
      return response.data.userAddress;
    } catch (error) {
      console.error('Error during login:', error.message);
      throw new Error('Failed to login. Please check your credentials.');
    }
  };

  const logoutUser = async () => {
    const response = await axios.post(`${API_BASE_URL}/api/user/logout`);
    if(response.data.message === 'Logout successful') {
    setIsAuthenticated(false);
    setIsWalletConnected(false);
    setUserId('');
    setUserAddress('');
  };
}
  // Wallet related functions

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = provider.getSigner();
          const account = await signer.getAddress();
          if (account) {
            setIsWalletConnected(true);
            setUserAddress(account);
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
          setIsWalletConnected(true);
          setUserAddress(accounts[0]);
        } else {
          setIsWalletConnected(false);
          setUserAddress('');
        }
      });
    }
  
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const handleRegistration = async (formData) => {
    try {
      // You need to implement the API call to register the user here
      // and handle the response accordingly
      console.log("Registration with password", formData.password);

      const response = await axios.post(`${API_BASE_URL}/api/user/register`, {
      username: formData.username,
      password: formData.password,
      walletAddress: userAddress,
      email: formData.email,
      image: formData.image,
      });
      setUsername(formData.username)
      console.log("Registration successful:", response.data);
      setShowRegistrationModal(false);
    } catch (error) {
      console.error('Error during registration:', error.message);
    }
  };

  const checkUserExists = async (walletAddress) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/${walletAddress}`);
      // If the user exists, you can set the authentication state here
      console.log("User found:", response.data);
      setIsAuthenticated(true);
      setUserId(response.data.userId);
      setUsername(response.data.username)
      setUserAddress(response.data.walletAddress);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If the user does not exist, show the registration popup
        setShowRegistrationModal(true);
      } else {
        console.error('Error checking user existence:', error.message);
      }
    }
  };
 
  const connectWallet = async () => {
    console.log('connecting wallet2');
    if(typeof window != "undefined" && typeof window.ethereum != "undefined"){
      try {
          console.log('yes')
          const provider =  new ethers.BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts();

          if (accounts.length === 0) {
            console.log('connecting wallet3');
            await window.ethereum.request({ method: 'eth_requestAccounts' });
          }
          console.log('connecting wallet4');
          const signer = await provider.getSigner();
          const account = await signer.getAddress();
          setIsWalletConnected(true);
          setUserAddress(account);
          

          await checkUserExists(account);
          console.log('connecting wallet5');

        } catch (error) {
          console.error('Error connecting wallet:', error);
        }
   
}}

  return (
    <UnifiedContext.Provider value={{ isAuthenticated, userId,userAddress, isWalletConnected, loginUser, logoutUser, connectWallet,handleRegistration }}>
      {children}
      {showRegistrationModal && (
        <ModalRegisterUsernamePassword
          onClose={() => setShowRegistrationModal(false)}
          onSubmit={handleRegistration}
        />
      )}
    </UnifiedContext.Provider>
  );
}; 

export default UnifiedProvider;
