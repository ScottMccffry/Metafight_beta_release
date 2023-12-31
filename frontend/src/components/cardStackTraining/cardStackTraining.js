// Importing necessary hooks and modules from React and other libraries
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import  UnifiedContext  from '../../context/UnifiedContext';
// Importing context to keep track of the selected card
import { SelectedCardContext } from '../../context/SelectedCardContext';

// Predefined array of colors
const colors = ["green", "yellow", "red", "black", "purple", "white"];

// Setting the API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

// Defining the CardStackTraining component
const CardStackTraining = () => {
  const { isConnected, connectWallet, isAuthenticated, userId, userAddress, loginUser } = useContext(UnifiedContext);

  // State to keep track of the card order
  const [cardOrder, setCardOrder] = useState(colors);
  // Using SelectedCardContext to get the function to set the selected card
  const { setSelectedCard } = useContext(SelectedCardContext);

  // useEffect hook to fetch user's fighters
  useEffect(() => {
    console.log('useEffect hook ran');

    const fetchUserFighters = async () => {
      // Check if the user is authenticated and has a userId
      if(isAuthenticated && userId ) {
        console.log('Authenticated and userId exists, making API call');
        try {
          // Making an API call to fetch the user's fighters
          const response = await axios.get(`${API_BASE_URL}/api/users_fighters_address/${userAddress}`);
          console.log('API call succeeded, setting card order with fighters ', response.data);
          setCardOrder(response.data);
        } catch (error) {
          console.log('API call failed with error:', error);
        }
      } else {
        console.log('Not authenticated or userId does not exist, skipping API call');
      }
    }
  
    fetchUserFighters();
  }, [isAuthenticated, userId, userAddress]);

  // Function to change the order of the cards
  const changeCard = () => {
    const newOrder = [cardOrder[cardOrder.length-1], ...cardOrder.slice(0, -1)];
    setCardOrder(newOrder);
    // Setting the top card as the selected card
    setSelectedCard(newOrder[0]);
  };

  // Function to log when the "Stake" action is taken
  const Stake = () => {
    console.log("Stake Clicked");
  };

  // Function to log when the "Unstake" action is taken
  const Unstake = () => {
    console.log("Unstake Clicked");
  };

  // Component's return (UI part)
  return (
    <div className="flex relative h-4/5 w-4/5 items-center justify-center" onClick={changeCard}>
      {cardOrder.map((fighter, index) => (
        <div 
          key={fighter.id} 
          className={`w-full h-full absolute rounded-lg transform transition-all duration-500 ease-in-out`}
          style={{
            top: '50%', 
            left: '50%', 
            transform: `translate(-50%, -50%) translateX(-${4*index}px) translateY(-${4*index}px)`, 
            zIndex: `${cardOrder.length - index}`
          }}
        >
          <div className="relative mt-3 pb-3/4 bg-gray-200 rounded-lg shadow-lg">
            <img src={fighter.image} className="w-full relative z-10" alt={fighter.name} />
          </div>
          <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
          <div className="bg-zinc-800 p-3 rounded-b-lg flex justify-between items-center">
            <button onClick={Stake} className="w-2/5 py-2 text-center font-medium hover:bg-gray-200 hover:text-blue-700 rounded-lg">Stake</button>
            <button onClick={Unstake} className="w-2/5 py-2 text-center text-white font-medium bg-gray-700 rounded-lg hover:bg-blue-700">Unstake</button>
          </div>
        </div>
      ))}
    </div>
  );
  
}

// Exporting the CardStackTraining component
export default CardStackTraining;
