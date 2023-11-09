// Importing necessary hooks and utilities from React and other libraries
import React, { useState, useEffect, useContext } from 'react';
import UnifiedContext from '../../context/UnifiedContext';
import axios from 'axios';

// Environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ALCHEMY_BASE_URL = process.env.REACT_APP_ALCHEMY_BASE_URL; // Add this line

// `FightModal` component definition
const FightModal = ({ closeModal }) => {
  // Accessing connected user's ID and wallet address from the WalletContext
  const {
    isConnected,
    connectWallet,
    isAuthenticated,
    userId,
    loginUser,
    walletAddress // Assuming this is how you get the user's wallet address
  } = useContext(UnifiedContext);

  // State management for the list of NFT collections, the selected NFT, and any errors
  const [nftCollections, setNftCollections] = useState([]);
  const [usersNfts, setUsersNfts] = useState([]); // Add this line
  const [compatibleNfts, setCompatibleNfts] = useState([]); // For storing compatible NFTs
  const [selectedNft, setSelectedNft] = useState('');
  const [error, setError] = useState('');

  // Effect hook to fetch the user's NFT collections when the component mounts
  useEffect(() => {
    const fetchNftCollections = async () => {
      try {
        // Making a GET request to fetch the NFT collections
        const response = await axios.get(`${API_BASE_URL}/api/nft-collections`);
        setNftCollections(response.data);
      } catch (error) {
        // Logging an error if the request fails
        console.error('Error fetching NFT collections:', error);
      }
    };

  const fetchUsersNfts = async () => {
    if (!walletAddress) return; // Make sure the wallet address is present
    
    const url = `${ALCHEMY_BASE_URL}/getNFTs/?owner=${walletAddress}`;

    try {
      const response = await axios.get(url);
      setUsersNfts(response.data); // Adjust this line based on the actual response structure
    } catch (err) {
      setError('An error occurred while fetching NFTs');
      console.error('error', err);
    }
  };

  fetchNftCollections();
  fetchUsersNfts();

}, [walletAddress]);
// Function to check compatible NFTs
const checkCompatibleNFTs = () => {
  const compatible = usersNfts.filter(userNft => 
    nftCollections.some(collection => 
      collection.nfts.some(nft => nft.tokenId === userNft.tokenId)//@TODO not tokenId I think
    )
  );
  setCompatibleNfts(compatible);
};
useEffect(() => {
  if (usersNfts.length > 0 && nftCollections.length > 0) {
    checkCompatibleNFTs();
  }
}, [usersNfts, nftCollections]); // This will check for compatible NFTs whenever either list changes


  // Handler function for when the user selects an NFT from the dropdown
  const handleNftChange = (e) => {
    setSelectedNft(e.target.value);
  };

  const handleResearchOpponent = async () => {
    if (!isConnected) {
      alert('You need to connect your wallet before requesting a fight');
      return;
    }

    // Indicate that the search has started
    setSearchInitiated(true);
    // Reset progress to 0
    setProgress(0);

    // Start the progress bar animation
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          // Here you can set the searchInitiated back to false if needed or handle the completed search
          return 100;
        }
        return prevProgress + 10; // Increment the progress
      });
    }, 1000); // Update every second (1000 milliseconds)

    try {
      await axios.post('/api/request_fight', {
        player_id: userId,
        nft_id: selectedNft,
      });
    } catch (error) {
      console.error('Error while requesting a fight:', error);
      // If there is an error, we stop the progress bar and reset
      clearInterval(interval);
      setSearchInitiated(false);
    }
  };

  // Render of the component
  return (
    // Modal overlay
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
      onClick={closeModal}
    >
      {/* Actual modal content (prevents propagation to not close when clicking inside) */}
      <div
        className="bg-zinc-900 p-6 rounded-md w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Start a Fight</h2>
        <label htmlFor="nft-select" className="block mb-2">
          Choose your NFT
        </label>
        {/* Dropdown for selecting NFT */}
        <select
          name="nft"
          id="nft-select"
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={handleNftChange}
        >
          <option value="">Select an NFT</option>
          {/* Looping through fetched NFT collections to populate the dropdown */}
          {nftCollections.map((nftCollection) => (
            <optgroup key={nftCollection.id} label={nftCollection.name}>
              {nftCollection.nfts.map((nft) => (
                <option
                  key={nft.tokenId}
                  value={nft.tokenId}
                >{`${nftCollection.name} #${nft.tokenId}`}</option>
              ))}
            </optgroup>
          ))}
        </select>
        {!searchInitiated ? (
          <button
            className="mt-4 py-2 bg-gradient-to-tr from-fuchsia-600 to-violet-600 rounded-md w-full"
            onClick={handleResearchOpponent}
            disabled={!isConnected}
          >
            Research an Opponent
          </button>
        ) : (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Exporting the FightModal component
export default FightModal;
