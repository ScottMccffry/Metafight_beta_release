//App.js
// Importing required modules for routing and layout
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import SideBarLeft from './components/sideBarLeft/sideBarLeft';
import Home from './pages/home/home';
import Marketplace from './pages/marketplace/marketplace';
import LiveFeed from './pages/liveFeed/liveFeed';
import Fight from './pages/fight/fight';
import styles from './App.css' // Importing CSS for the app
import WalletProvider from './context/WalletProvider'; // Context for wallet
import AuthProvider from './context/AuthProvider'; // Context for authentication
import MintingPage from './pages/minting/minting';
import Profile from './pages/profile/profile';
import Stacking from './pages/staking/staking';
import Training from './pages/training/training';
import Nft from './pages/nft/nft';
import { SocketProvider } from './context/SocketContext';

// Importing hooks and socket.io client
import { useEffect, useState } from 'react';


const API_BASE_URL = process.env.REACT_APP_API_BASE_UR
function App() {

  return (
    <AuthProvider>
      <WalletProvider>
        <SocketProvider>
        <Router>
          <body className="text-zinc-200 w-screen h-full">
            <SideBarLeft />
            <Header />
            <Routes>
              {/* Defining the various routes of the application */}
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/profile/:walletAddress" element={<Profile />} />
              <Route path="/live-feed" element={<LiveFeed />} />
              <Route path="/fight/:fightId" element={<Fight />} />
              <Route path="/mint" element={<MintingPage />} />
              <Route path="/nft/:nftAddress" element={<Nft />} />
              <Route path="/stacking" element={<Stacking />} />
              <Route path="/training" element={<Training />} />
            </Routes>
          </body>
          {/* Adding script for styling */}
          <script src="../../node_modules/flowbite/dist/flowbite.min.js"></script>
        </Router>
        </SocketProvider>
      </WalletProvider>
    </AuthProvider>
  );
}

// Exporting the App component to be used in other parts of the application
export default App;