// Importing necessary hooks and utilities from React and other libraries
import React, { useState, useEffect, useContext } from 'react';
import WalletContext from '../../context/WalletContext';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
// `FightModal` component definition
const FightModal = ({ isConnected, closeModal }) => {
  // Accessing connected user's ID from the WalletContext
  const { connectedUserId } = useContext(WalletContext);

  // State management for the list of NFT collections and the selected NFT
  const [nftCollections, setNftCollections] = useState([]);
  const [selectedNft, setSelectedNft] = useState('');

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

    // Calling the fetch function
    fetchNftCollections();
  }, []);

  // Handler function for when the user selects an NFT from the dropdown
  const handleNftChange = (e) => {
    setSelectedNft(e.target.value);
  };

  // Handler function to initiate a fight search for an opponent
  const handleResearchOpponent = async () => {
    if (!isConnected) {
      alert('You need to connect your wallet before requesting a fight');
      return;
    }

    try {
      // Making a POST request to start the fight process
      await axios.post('/api/request_fight', {
        player_id: connectedUserId,
        nft_id: selectedNft,
      });
    } catch (error) {
      console.error('Error while requesting a fight:', error);
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
        {/* Button to start the fight */}
        <button
          className="mt-4 py-2 bg-gradient-to-tr from-fuchsia-600 to-violet-600 rounded-md w-full"
          onClick={handleResearchOpponent}
          disabled={!isConnected}
        >
          Research an Opponent
        </button>
      </div>
    </div>
  );
};

// Exporting the FightModal component
export default FightModal;
