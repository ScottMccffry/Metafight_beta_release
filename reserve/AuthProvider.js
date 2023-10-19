//To do : 
//HTTP Only Cookie set up


import React, { useState } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';


const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('user'));//useState is being called with a function that checks if there is a 'user' item in localStorage.
  const [userId, setUserId] = useState('');

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, { email, password });
      
      // Store token in HTTP Only Cookie instead of local storage for security
      // Assuming backend sets this automatically on successful login
      //if (response.data.token) {
    // store this token in local storage for developping purposes
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log("Is Authenticated:", isAuthenticated); // Log isAuthenticated state
      setIsAuthenticated(true);
      setUserId(response.data.userId);
      return response.data.userId;
      // }
    } catch (error) {
      console.error('Error during login:', error.message);
      throw new Error('Failed to login. Please check your credentials.');
    }
  };

  const logoutUser = () => {
    // Server should invalidate token on logout
    axios.post(`${API_BASE_URL}/api/users/logout`);
    setIsAuthenticated(false);
    setUserId('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

