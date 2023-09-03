// Importing necessary hooks and modules
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import WalletContext from '../../../../frontend/src/context/WalletContext';
import AuthContext from '../../../../frontend/src/context/AuthContext';

// Predefined array of colors
const colors = ["green", "yellow", "red", "black", "purple", "white"];

// Setting the API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const CardStack = () => {
  // Using WalletContext to get wallet related data and functions
  const { isConnected, connectWallet } = useContext(WalletContext);
  // Using AuthContext to get authentication related data and functions
  const { isAuthenticated, userId, loginUser } = useContext(AuthContext);
  
  // State to keep track of card order
  const [cardOrder, setCardOrder] = useState(colors);

  useEffect(() => {
    // This effect logs every time it's called
    console.log('useEffect hook ran');

    // Function to fetch fighters associated with the authenticated user
    const fetchUserFighters = async () => {
      // Check if the user is authenticated and userId is available
      if(isAuthenticated && userId) {
        console.log('Authenticated and userId exists, making API call');
        try {
          // Making an API call to fetch the fighters
          const response = await axios.get(`${API_BASE_URL}/api/Usersfighters/${userId}`);
          console.log('API call succeeded, setting card order with fighters ', response.data);
          setCardOrder(response.data);
        } catch (error) {
          console.log('API call failed with error:', error);
        }
      } else {
        console.log('Not authenticated or userId does not exist, skipping API call');
      }
    }
  
    // Call the fetch function
    fetchUserFighters();
  }, [isAuthenticated, userId]);

  // Function to change the order of cards
  const changeCard = () => {
    const newOrder = [cardOrder[cardOrder.length-1], ...cardOrder.slice(0, -1)];
    setCardOrder(newOrder);
  };

  // Function to log when the "Stake" action is taken
  const Stake = () => {
    console.log("View Specs Clicked");
  };

  // Function to log when the "Unstake" action is taken
  const Unstake = () => {
    console.log("View Sale Clicked");
  };

  // Component's return (UI part)
  return (
    <div className='h-4/5 w-4/5'>
      <div className="flex relative h-4/5 w-4/5 items-center justify-center" onClick={changeCard}>
        {cardOrder.map((fighter, index) => (
          <div 
            key={fighter.id} 
            className={`w-full h-full absolute rounded-lg transform transition-all duration-500 ease-in-out`}
            style={{top: `${-4*index}px`, left: `${-4*index}px` , zIndex: `${cardOrder.length - index}`}}
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
    </div>
  );
}

// Exporting the CardStack component
export default CardStack;
