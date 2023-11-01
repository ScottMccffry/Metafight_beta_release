import React, { useState, useContext } from 'react';
import axios from 'axios';
import UnifiedContext from '../../context/UnifiedContext';

const ModalRegisterUsernamePassword = ({ onClose, onSubmit, userAddress }) => {
  const { connectWallet } = useContext(UnifiedContext);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    walletAddress: userAddress,
    email: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
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
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-white">Username</label>
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
            <label htmlFor="password" className="block mb-2 text-white">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder={userAddress}
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
              name="wallet "
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
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2 text-white">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.image}
              onChange={handleChange}
            />
          </div>
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
