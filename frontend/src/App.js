//App.js
// Importing required modules for routing and layout
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import SideBarLeft from './components/sideBarLeft/sideBarLeft';
import Home from './pages/home/home';
import Marketplace from './pages/marketplace/marketplace';
import LiveFeed from './pages/liveFeed/liveFeed';
import Fight from './pages/fight/fight';
import styles from './App.css' // Importing CSS for the app
import WalletProvider from './context/WalletProvider'; // Context for wallet
import AuthProvider from './context/AuthProvider'; // Context for authentication
import MintingPage from './pages/MintingPage/MintingPage';
import Profile from './pages/Profile/Profile';
import Stacking from './pages/Stacking/Stacking';
import Training from './pages/Training/Training';
import Nft from './pages/Nft/Nft';
import { SocketProvider } from './context/SocketContext';

// Importing hooks and socket.io client
import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';


function App() {
  // State to manage socket connection
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initiating socket connection
    const newSocket = socketIOClient(API_BASE_URL);
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });
    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    setSocket(newSocket);

    // Cleaning up the connection on unmount
    return () => {
      console.log('Closing socket connection');
      newSocket.close();
    };
  }, []);

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
              <Route path="/marketplace" element={<Marketplace socket={socket} />} />
              <Route path="/profile/:walletAddress" element={<Profile />} />
              <Route path="/live-feed" element={<LiveFeed socket={socket}/>} />
              <Route path="/fight/:fightId" element={<Fight socket={socket}/>} />
              <Route path="/mint" element={<MintingPage />} />
              <Route path="/nft/:nftAddress" element={<Nft socket={socket}/>} />
              <Route path="/stacking" element={<Stacking />} />
              <Route path="/training" element={<Training />} />
            </Routes>
          </body>
          {/* Adding a script for styling */}
          <script src="../../node_modules/flowbite/dist/flowbite.min.js"></script>
        </Router>
        </SocketProvider>
      </WalletProvider>
    </AuthProvider>
  );
}

// Exporting the App component to be used in other parts of the application
export default App;