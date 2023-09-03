// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import BetsHistory from '../../components/betsHistory/betsHistory';
import LiveStream from '../../components/liveStream/liveStream';
import TwitchChat from '../../components/twitchChat/twitchChat';
import LiveData from '../../components/liveData/liveData';
import SideBarRightBet from '../../components/sideBarRightBet/sideBarRightBet';

const API_BASE_URL = process.env.REACT_APP_API_BASE_UR
// Define the Fight component
const Fight = () => {
  // Retrieve location and fight data from location state
  const location = useLocation();
  const fightDataIn = location.state?.fightData || null;

  // Extract the fightId parameter from the URL
  const { fightId } = useParams();

  // Define state variables
  const [fightData, setFightData] = useState(fightDataIn);
  const [betsData, setBetsData] = useState(null);
  const [showBetSidebar, setShowBetSidebar] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);

  // Function to handle bet click
  const handleBetClick = (fightBet) => {
    setSelectedBet(fightBet);
    setShowBetSidebar(true);
  };

  // Function to close the bet sidebar
  const closeBetSidebar = () => {
    setShowBetSidebar(false);
  };

  // Fetch fight data and bets data using useEffect
  useEffect(() => {
    // Fetch fight data if not already available
    if (!fightData) {
      const fetchFightData = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/fight/${fightId}`);
          setFightData(response.data);
        } catch (error) {
          console.error(`Error fetching fight data: ${error}`);
        }
      };
      fetchFightData();
    }

    // Fetch bets data related to the fight
    const fetchBetsData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/betshistory/${fightId}`);
        setBetsData(response.data);
      } catch (error) {
        console.error(`Error fetching bets data: ${error}`);
      }
    };
    fetchBetsData();
  }, [fightId, fightData]);

  // Render the Fight component
  return (
    <div className="flex flex-col md:flex-row h-screen p-4">
      {/* Sidebar */}
      <div className="w-48 hidden lg:block shrink-0" />

      {/* Main content */}
      <div className="flex-grow relative">
        {/* Live stream and live data section */}
        <div className="flex flex-col md:flex-row justify-between h-1/2 mt-2">
          {/* Live stream */}
          <div className="h-full md:w-full md:pr-2 flex items-center justify-center">
            <div className="w-full h-full">
              <LiveStream />
            </div>
          </div>
          
          {/* Live data */}
          <div className="h-full md:w-1/2 md:pl-2 flex items-center justify-center md:pr-4">
            <div className="w-full">
              {fightData && <LiveData onBetClick={handleBetClick} fightData={fightData} />}
            </div>
          </div>
        </div>
        
        {/* Bets history section */}
        <div className="w-full mt-10 md:absolute md:top-1/2 md:pr-4">
          {fightData && betsData && <BetsHistory betsHistoryIn={betsData} fightData={fightData} />}
        </div>
      </div>
      
      {/* Display the bet sidebar or Twitch chat */}
      {showBetSidebar ? <SideBarRightBet fightBet={selectedBet} closeBetSidebar={closeBetSidebar}/> : <TwitchChat />}
    </div>
  );
};

// Export the Fight component
export default Fight;

