import React, { useState, useContext } from 'react';
import axios from 'axios';
import UnifiedContext from '../../context/UnifiedContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const ModalRegisterUsernamePassword = ({ onClose, onSubmit }) => {
  const {
    loginUser,
    logoutUser,
    isAuthenticated,
    userId,
    userAddress,
    isWalletConnected,
    handleRegistration,

  } = useContext(UnifiedContext);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    walletAddress: userAddress,
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
   // Call this function when the user submits the registration form
  const onRegistrationSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      console.log('register', formData); // Check what data is being sent
      handleRegistration(formData);
      // handle additional logic after successful registration if needed
    } catch (error) {
      // Handle registration error
      console.error('Registration Error:', error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 p-6 rounded-md w-full max-w-lg"
        onClick={(formData) => formData.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">Register</h2>
        <form onSubmit={onRegistrationSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-white">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-white">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="walletAddress" className="block mb-2 text-white">Wallet Address</label>
            <input
              type="text"
              id="walletAddress"
              name="walletAddress"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.walletAddress}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
      
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-white">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <h3 className="mb-2 text-white text-md">*Mandatory fields</h3>
          <button
            type="submit"
            className="py-2 bg-gradient-to-tr from-fuchsia-600 to-violet-600 rounded-md w-full"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalRegisterUsernamePassword;
