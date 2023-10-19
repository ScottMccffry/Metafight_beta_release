// WalletContext.js
import { createContext } from 'react';

const WalletContext = createContext({
  isConnected: false,
  connectedUserId: '',
  connectWallet: () => {},
});

export default WalletContext;