import React, { useState, useContext } from 'react';
import axios from 'axios';
import UnifiedContext from '../../context/UnifiedContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const ModalRegisterUsernamePassword = ({ onClose, onSubmit }) => {
  const { userAddress } = useContext(UnifiedContext);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/register`, formData);
      console.log('User registered successfully:', response.data);
      if(onSubmit) await onSubmit(formData);
    } catch (error) {
      console.error('Error registering user:', error.response ? error.response.data : error.message);
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 p-6 rounded-md w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">Register</h2>
        <form onSubmit={handleSubmit}>
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
