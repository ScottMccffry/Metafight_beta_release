// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NonFungibleToken from '../../components/nonFungibleToken/nonFungibleToken';
import FighterSpecs from '../../components/fighterSpecs/fighterSpecs';
import SaleData from '../../components/saleData/saleData';

// Define the base URL for API requests
const API_BASE_URL = 'http://127.0.0.1:5000';

// Create the Nft component
const Nft = () => {
  // Extract the nftAddress from the URL parameters
  const { nftAddress } = useParams();

  // Define state variables using the useState hook
  const [nftData, setNftData] = useState(null);
  const [fighterCharacteristics, setFighterCharacteristics] = useState(null);
  const [showfighterSpecs, setShowFighterSpecs] = useState(null);
  const [showSaleData, setShowSaleData] = useState(true);

  // Event handler to switch to the fighter specs view
  const viewSpecsClick = () => {
    setShowFighterSpecs(true);
    setShowSaleData(false);
  };

  // Event handler to switch to the sale data view
  const viewSaleClick = () => {
    setShowFighterSpecs(false);
    setShowSaleData(true);
  };

  // useEffect hook to fetch data when the component mounts or when nftAddress changes
  useEffect(() => {
    // Function to fetch NFT data
    const fetchNftData = async () => {
      try {
        // Send a GET request to fetch NFT data using the nftAddress
        const result = await axios.get(`${API_BASE_URL}/marketplace-item/${nftAddress}`);
        // Update the state with the fetched data
        setNftData(result.data);
      } catch (error) {
        console.error('Error fetching NFT:', error);
      }
    };

    // Function to fetch fighter characteristics data
    const fetchFighterCharacteristics = async () => {
      try {
        // Send a GET request to fetch fighter characteristics using nftAddress
        const response = await axios.get(`${API_BASE_URL}/api/fetch_fighter_characteristics/${nftAddress}`);
        // Update the state with the fetched data
        setFighterCharacteristics(response.data);
      } catch (error) {
        console.error('Error fetching fighter characteristics:', error);
      }
    };

    // Call the data fetching functions when the component mounts or nftAddress changes
    fetchFighterCharacteristics();
    fetchNftData();
  }, [nftAddress]);

  // Render the Nft component
  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-48 hidden lg:block shrink-0" />
      <div className="flex flex-row flex-grow mt-3 w-full justify-center items-center mt-4 h-full">
        <div className="bg-zinc-800 rounded-lg pb-5 pt-5 w-2/5 mr-1">
          {nftData && <NonFungibleToken nftData={nftData} fighterCharacteristics={fighterCharacteristics} viewSpecsClick={viewSpecsClick} viewSaleClick={viewSaleClick} />}
        </div>
        <div className="bg-zinc-800 rounded-lg w-2/5 pb-5 pt-5 h-full ml-1">
          {showSaleData && !showfighterSpecs && <SaleData />}
          {!showSaleData && showfighterSpecs && <FighterSpecs />}
        </div>
      </div>
    </div>
  );
};

// Export the Nft component
export default Nft;
