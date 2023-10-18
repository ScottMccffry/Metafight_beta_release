// Import necessary modules and components
import React, { useState, useEffect, useContext } from 'react';
import {SocketContext} from '../../context/SocketContext';
import axios from 'axios';

// Define the API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Define the LiveData component
const LiveData = ({ fightData, onBetClick }) => {

    
  // Destructure fightData props
  let { fightId, fighter1, fighter2, odd1, odd2 } = fightData;

  // Define state variables
  const [odds, setOdds] = useState(null);
  const [odd1Socket, setOdd1Socket] = useState(odd1);
  const [odd2Socket, setOdd2Socket] = useState(odd2);
  const [liveGameData, setLiveGameData] = useState(null);

  // Access the SocketContext
  const socket = useContext(SocketContext);

  // Function to handle fighter bet click
  const handleFighterBetClick = (event, fightBet) => {
    event.stopPropagation();
    console.log("BET OBJECT: ", fightBet);
    if (onBetClick) {
      onBetClick(fightBet);
    }
  };

  /*
  useEffect(() => {
    const fetchGameData = () => {
      axios.get(`${API_BASE_URL}/api/fetch_live_data`)
      .then(response => response.json())
      .then(data => {
        setLiveGameData(data);
      });
    }
      // Call fetchGameData immediately and then every second
      fetchGameData();
      const intervalId = setInterval(fetchGameData, 1000);
  });*/
  
  // useEffect hook to set up socket event listeners and update odds
  useEffect(() => {
    console.log('Items useEffect hook ran with socket:', socket);

    if (socket) {
      console.log('Setting up update event listener');

      socket.on('update_odd', (data) => {
        console.log('Update_odds event received with data :', data);
        console.log('Data fight_id:', data.fight_id);
        console.log('Data odds:', data.odds);

        if (fightId === data.fight_id) {
          console.log('Updating odds for fight:', fightId);
          setOdd1Socket(data.odds.odd1);
          setOdd2Socket(data.odds.odd2);
        }
      });

      socket.on('update_score', (data) => {
        console.log('Update_score event received with data :', data);
        // Additional code related to updating scores
      });
    }

    // Clean up the event listeners on unmount
    return () => {
      if (socket) {
        socket.off('update');
        console.log('Removed update event listener');
      }
    };
  }, [socket, fightId]);

  // Render the LiveData component
  return (
    <div className="flex items-center justify-center w-full ">
      {/* Live data display */}
      <div className="bg-zinc-800  flex flex-col min-w-[200px] rounded-lg shadow-md">
        {/* Live data header */}
        <div className="flex items-center justify-between border-b bg-zinc-700 text-gray-400 p-4 rounded-lg">
          <div className="bg-red-100 text-red-600 flex items-center px-3 py-2 rounded text-sm font-semibold">
            <div className="bg-red-600 w-1.5 h-1.5 rounded-full mr-2"></div>
            Live
          </div>
          <div className="flex items-center font-semibold">Fight</div>
        </div>

        {/* Time display */}
        <div className="flex items-center justify-between text-gray-400 p-4 pb-0 rounded-lg">
          <div className="text-md text-gray-500">
            at <strong className="text-gray-900">{new Date().toLocaleTimeString()}</strong>
          </div>
        </div>

        {/* Fighters' information and odds */}
        <div className="flex relative">
          {/* Fighter 1 */}
          <div className="flex items-center justify-center w-1/3 p-8 pt-0">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white shadow-md">
                <img className="w-24" src={fighter1.image} />
              </div>
              <h2 className="mt-6 text-l font-semibold">{fighter1.name}</h2>
            </div>
          </div>

          {/* Match details */}
          <div className="flex flex-col items-center w-1/3 h-4/5 p-8 pt-0">
            {/* Score */}
            <div className="flex items-center mt-10 mb-5">
              <span className="text-4xl font-semibold text-indigo-600">S1</span>
              <span className="text-2xl font-extrabold text-gray-300 mx-2">:</span>
              <span className="text-4xl font-semibold">S2</span>
            </div>

            {/* Odds and betting buttons */}
            <div className="flex mt-2">
              <button className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-16 rounded-md font-semibold h-12 p-px mr-1">
                <div className="bg-zinc-800 w-full h-full rounded-md grid place-items-center">
                  {odd1}
                </div>
              </button>
              <button className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-16 rounded-md font-semibold h-12 p-px py-1 mx-1 ml-1">
                {odd2}
              </button>
            </div>

            {/* Betting buttons with updated odds */}
            <div className="flex mt-2">
              <button
                onClick={(event) => {
                  console.log("Button clicked");
                  handleFighterBetClick(event, {
                    fightId: fightId,
                    selectedFighter: fighter1,
                    fighter1: fighter1,
                    fighter2: fighter2,
                    odd: odd1Socket,
                  });
                }}
                className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-16 rounded-md font-semibold h-12 p-px mr-1"
              >
                <div className="bg-zinc-800 w-full h-full rounded-md grid place-items-center">
                  {odd1Socket}
                </div>
              </button>
              <button
                onClick={(event) => {
                  console.log("Button clicked");
                  handleFighterBetClick(event, {
                    fightId: fightId,
                    selectedFighter: fighter2,
                    fighter1: fighter1,
                    fighter2: fighter2,
                    odd: odd2Socket,
                  });
                }}
                className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-16 rounded-md font-semibold h-12 p-px ml-1"
              >
                {odd2Socket}
              </button>
            </div>
          </div>

          {/* Fighter 2 */}
          <div className="flex items-center justify-center w-1/3 p-8 pt-0">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white shadow-md">
                <img className="w-24" src={fighter2.image} />
              </div>
              <h2 className="mt-6 text-l font-semibold">{fighter2.name}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the LiveData component
export default LiveData;