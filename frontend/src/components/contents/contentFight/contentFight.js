import React, { useState, useContext } from 'react';
import axios from 'axios';
import UnifiedContext from '../../../context/UnifiedContext';
import FightModal from '../../fightModal/fightModal';

// Define the base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
function ContentFight() {
  // State to control the visibility of the modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Get the `isConnected` value from the WalletContext
  const { isConnected } = useContext(UnifiedContext);

  // Handler for the button click event
  const handleButtonClick = () => {
    if (isConnected) { // Ensure the user is connected before initiating a fight
      startFight();
    } else {
      setIsModalVisible(true); // Show modal if the user is not connected
      alert("Please connect before starting a fight.");
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Function to start a fight
  const startFight = () => {
    axios.post(`${API_BASE_URL}/api/start_game`)
      .then(response => {
        console.log(response.data); // Log the server's response
      })
      .catch(error => {
        console.log("Error starting fight:", error); // Handle any errors
      });
  };
  return (
    <div className="">
      <h1 className="text-2xl font-bold px-3 mt-3">Live Matches</h1>
      <h2 className="text-zinc-500 px-3">
        See all the live and programmed fights
      </h2>
      
      <div className="p-3">
        {/* Promotion section with a background image */}
        <div
          className="w-full h-44 rounded-md bg-center bg-cover flex flex-col justify-center px-4"
          style={{
            backgroundImage:
              'url(https://assets.codepen.io/3685267/nft-dashboard-art-6.jpg)',
          }}
        >
          <h2 className="font-bold text-3xl max-w-sm">Promotion</h2>
          <button className="py-2 bg-gradient-to-tr from-fuchsia-600 to-violet-600 rounded-md w-44 mt-3">
            Profit from the discount
          </button>
        </div>
      </div>

      {/* Section for starting a fight */}
      <div className="flex flex-col md:flex-row justify-between px-3 mt-3">
        <h2 className="text-xl font-semibold">Trending upcoming fights</h2>
        <button
          className="py-2 bg-gradient-to-tr from-fuchsia-600 to-violet-600 rounded-md w-44 mt-3"
          onClick={handleButtonClick}
        >
          Start a fight
        </button>
      </div>

      {/* Conditionally render the FightModal if `isModalVisible` is true */}
      {isModalVisible && (
        <FightModal isConnected={isConnected} closeModal={closeModal} />
      )}
    </div>
  );
}

// Export the component for use in other parts of the application
export default ContentFight;