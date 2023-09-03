import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Countdown from 'https://cdn.skypack.dev/react-countdown';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

/**
 * FightItem represents an individual fight card.
 */
function FightItem({ id, fighter1, fighter2, odd1, odd2, time_left, onBetClick }) {
  const navigate = useNavigate();

  // Handles the betting click event
  const handleFighterBetClick = (event, fightBet) => {
    event.stopPropagation();
    if (onBetClick) {
      onBetClick(fightBet);
    }
  };

  return (
    <div className="w-full lg:w-1/2 xl:w-1/3 p-1.5 h-80">
      <div 
        className="block bg-zinc-800 rounded-md w-full h-full overflow-hidden pb-4 shadow-lg transform transition-all duration-200 hover:scale-105 relative"
        onClick={() => navigate(`/fight/${id}`, { state: { fightData: { id, fighter1, fighter2, odd1, odd2, time_left } } })}
        tabIndex={0}
      >
        <div className="flex md:flex-row mt-2">
          <div
            className="w-full h-40 bg-center bg-cover relative  md:w-1/2 ml-2 rounded-sm"
            style={{ backgroundImage: `url(${fighter1.image})` }}
          />
          <div
            className="w-full h-40 bg-center bg-cover relative  md:w-1/2 mr-2 rounded-sm"
            style={{ backgroundImage: `url(${fighter2.image})` }}
          />
        </div>
        <Countdown
          date={Date.now() + time_left}
          renderer={({ hours, minutes, seconds, completed }) => {
            if (completed) {
              return <div className="bg-red-100 bg-opacity-60 text-red-600 flex items-center px-3 py-2 rounded text-sm font-semibold absolute top-0 left-0 mt-2 ml-2">Live</div>;
            } else {
              return (
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 bg-white rounded-md flex items-center bg-opacity-30 backdrop-blur-md justify-center py-2">
                  <h3 className="font-semibold">Starting in </h3>
                  <div>{`${hours}h: ${minutes}m: ${seconds}s`}</div>
                </div>
              );
            }
          }}
        />

<div className="w-full flex justify-around items-end pb-4 h-1/2">
          <div className="w-2/5 text-center ml-2">
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-m">{fighter1.name}</h3>
              <span className="text-zinc-400 text-sm mb-2">{fighter1.collection}</span>
              <button
  onClick={(event) => { 
    console.log("Button clicked"); 
    handleFighterBetClick(event, {fightId: id, selectedFighter: fighter1, fighter1: fighter1, fighter2: fighter2, odd: odd1 })
  }}
  className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-4/5 rounded-md font-semibold h-12 p-px mt-2"
>
  {odd1}
</button>
            </div>
          </div>

          <div className="w-1/5 flex flex-col items-center h-1/2">
            <h3 className="font-semibold text-sm">VS</h3>
          </div>

          <div className="w-2/5 text-center mr-2">
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-m">{fighter2.name}</h3>
              <span className="text-zinc-400 text-sm mb-2">{fighter2.collection}</span>
              <button
                onClick={(event) => handleFighterBetClick(event, { fightId: id, selectedFighter: fighter2, fighter1: fighter1, fighter2: fighter2, odd: odd2 })}
                className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-4/5 rounded-md font-semibold h-12 p-px mt-2 mr-1"
              >
                <div className="bg-zinc-800 w-full h-full rounded-md grid place-items-center">
                  {odd2}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Items({ onBetClick, socket }) {
  console.log('Items component rendered');
  const [fights, setFights] = useState([]);
  const [fighters, setFighters] = useState([]);
  {/* const requestedUpdates = useRef(new Set()); Store IDs of fights that have requested updates */}


  console.log('Items component rendered with socket :', socket);

  useEffect(() => {
    console.log('Items useEffect hook ran with socket:', socket);

    if (socket) {
      console.log('Setting up update event listener');
      
      socket.on('update_odd', (data) => {
        console.log('Update event received with data YOLO:', data);
        console.log('Data fight_id:', data.fight_id);
        console.log('Data odds:', data.odds);
      
        setFights((currentFights) => 
          currentFights.map((fight) => {
            console.log('Current fight:', fight);
            if (fight.id === data.fight_id) {
              console.log('Updating fight:', fight.id);
              return {...fight, odd1: data.odds.odd1, odd2: data.odds.odd2};
            } else {
              return fight;
            }
          })
        );
      
        console.log('Updated fights:', fights);
      });
    }
    
    return () => {
      if (socket) {
        socket.off('update');
        console.log('Removed update event listener');
      }
    };
  }, [socket]);

  useEffect(() => {
    console.log(fights);
  }, [fights]);
  useEffect(() => {
    async function fetchFights() {
      const response = await axios.get(`${API_BASE_URL}/api/fights?limit=10`);
      const fightsData = response.data;
      setFights(fightsData);
      // Emit the 'request_update' event for each fight
      fightsData.forEach(fight => {
        console.log("Emitting request_update for fight", fight.id);
        socket.emit('request_update_odd', { fight_id: fight.id });
      });
    }

    async function fetchFighters() {
      const response = await axios.get(`${API_BASE_URL}/api/fighters`);
      setFighters(response.data);
      console.log("Fetched fighters:", response.data);
    }

    // Call fetchFights and fetchFighters once the component mounts
    fetchFights();
    fetchFighters();
  }, []);

  return (
     <>
    <div className="p-1.5 flex flex-wrap">
      {fights.map((fight) => (
        <FightItem 
          key={fight.id} 
          {...fight} 
          onBetClick={onBetClick} 
        />
      ))}
      


    </div>
    <nav aria-label="Page navigation example">
    <ul class="inline-flex -space-x-px text-sm">
      <li>
        <a href="" class="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
      </li>
      <li>
        <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
      </li>
      <li>
        <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
      </li>
      <li>
        <a href="#" aria-current="page" class="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
      </li>
      <li>
        <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
      </li>
      <li>
        <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
      </li>
      <li>
        <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
      </li>
    </ul>
  </nav>
  </>
  );
}

export default Items;
