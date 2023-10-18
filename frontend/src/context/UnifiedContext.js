import { createContext } from 'react';

// Unified context that combines both AuthContext and WalletContext
const UnifiedContext = createContext({
  // Authentication related states and functions
  isAuthenticated: false,
  userId: '',
  loginUser: () => {},
  logoutUser: () => {},

  // Wallet related states and functions
  isConnected: false,
  connectedUserId: '',
  connectWallet: () => {},
  // Add any other wallet-related functions here
});

export default UnifiedContext;
