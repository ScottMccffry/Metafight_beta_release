// Import necessary React hooks, axios for making API requests and useParams for accessing router parameters
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Define the base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

// Define the NonFungibleToken functional component. It takes in optional props:
// - fighterCharacteristicsIn (default characteristics of the fighter)
// - nftDataIn (default data for the NFT)
// - viewSaleClick (callback function for when the "View Sale Info" button is clicked)
// - viewSpecsClick (callback function for when the "View specs" button is clicked)
const NonFungibleToken = ({ fighterCharacteristicsIn, nftDataIn, viewSaleClick, viewSpecsClick }) => {
  
  // State management for the fighter's characteristics and the NFT's data
  const [fighterCharacteristics, setFighterCharacteristics] = useState(fighterCharacteristicsIn || {});
  const [nftData, setNftData] = useState(nftDataIn || {});
  
  // Use the useParams hook to retrieve the nftAddress from the route
  const { nftAddress } = useParams();

  // useEffect hook to fetch the fighter's characteristics and NFT data if they aren't passed as props
  useEffect(() => {

    // Fetch the fighter's characteristics if it's not passed as a prop
    if (!fighterCharacteristicsIn) {
      const fetchFighterCharacteristics = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/fetch_fighter_characteristics/${nftAddress}`);
          setFighterCharacteristics(response.data);
        } catch (error) {
          console.error('Error fetching fighter:', error);
        }
      };
      fetchFighterCharacteristics();
    }

    // Fetch the NFT's data if it's not passed as a prop
    if (!nftDataIn) {
      const fetchNftData = async () => {
        try {
          const result = await axios.get(`${API_BASE_URL}/marketplace-item/${nftAddress}`);
          setNftData(result.data);
        } catch (error) {
          console.error('Error fetching item data:', error);
        }
      };
      fetchNftData();
    }

  }, [fighterCharacteristicsIn, nftDataIn, nftAddress]);

  // Destructure values from the fighterCharacteristics and nftData for use within the JSX below
  let image, name, game_characteristics, price;
  if (nftData && fighterCharacteristics) {
    ({ image, name, game_characteristics } = fighterCharacteristics);
    ({ price } = nftData);
  }
  return (
    <div className="h-full">
    <div className="mr-1">
    <div className="bg-zinc-800 rounded-lg p-3">
      <div className="flex justify-between text-sm font-medium">
        <div className="flex space-x-2">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex flex-col justify-center">
            <span className="text-xs text-gray-400">Owned by</span>
            <span className="font-medium">2304RC</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex flex-col justify-center text-right">
            <span className="text-xs text-gray-400">Created by</span>
            <span className="font-medium">20AR02</span>
          </div>
        </div>
      </div>
      <hr
  className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
      <div className="relative mt-3 pb-3/4 bg-gray-200 rounded-lg shadow-lg">
        
      <img src={image} className="w-full relative z-10" alt={name} /> 
      </div>
    </div>
    <div className="flex justify-between p-3">
      <p><b>Price:</b> ETH {price}</p>
      {/*<p>($3,565.48)</p>*/}   
       </div>
    <div className="bg-zinc-800 p-3 rounded-b-lg flex justify-between items-center">
     <button onClick={viewSpecsClick} className="w-2/5 py-2 text-center font-medium hover:bg-gray-200 hover:text-blue-700 rounded-lg">View specs</button>
      <button  onClick={viewSaleClick} className="w-2/5 py-2 text-center text-white font-medium bg-gray-700 rounded-lg hover:bg-blue-700">View Sale Info</button>
    </div>
    </div>
    
    </div>
    
);

}

export default NonFungibleToken;
