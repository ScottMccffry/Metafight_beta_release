import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import BetsHistory from '../../components/betsHistory/BetsHistory';
import LiveStream from '../../components/liveStream/LiveStream';
import TwitchChat from '../../components/twitchChat/TwitchChat';
import LiveData from '../../components/liveData/LiveData';
import SideBarRightBet from '../../components/sideBarRightBet/SideBarRightBet';

const API_BASE_URL = 'http://127.0.0.1:5000';

const Fight = ({ socket }) => {
  const location = useLocation();
  const fightDataIn = location.state?.fightData || null; // Retrieve fight data from location state if available
  const { fightId } = useParams();
  const [fightData, setFightData] = useState(fightDataIn);
  const [betsData, setBetsData] = useState(null);
  const [showBetSidebar, setShowBetSidebar] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);

  // Function to handle bet click
  const handleBetClick = (fightBet) => {
    setSelectedBet(fightBet);
    setShowBetSidebar(true);
  };
  const closeBetSidebar = () => {
    setShowBetSidebar(false);
  };

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

  return (
    <div className="flex flex-col md:flex-row h-screen p-4">
      <div className="w-48 hidden lg:block shrink-0" />
      <div className="flex-grow relative">
        <div className="flex flex-col md:flex-row justify-between h-1/2 mt-2">
          <div className="h-full md:w-full md:pr-2 flex items-center justify-center ">
            <div className="w-full h-full">
              <LiveStream />
            </div>
          </div>
          <div className="h-full md:w-1/2 md:pl-2 flex items-center justify-center md:pr-4">
            <div className="w-full">
            {fightData && <LiveData onBetClick={handleBetClick} fightData={fightData} />}
            </div>
          </div>
        </div>
        <div className="w-full mt-10 md:absolute md:top-1/2 md:pr-4">
         {fightData && betsData && <BetsHistory betsHistoryIn={betsData} fightData={fightData} socket={socket} />}
        </div>
      </div>
      {showBetSidebar ? <SideBarRightBet fightBet={selectedBet} closeBetSidebar={closeBetSidebar} socket={socket}/> : <TwitchChat />}
    </div>
  );
};

export default Fight;
