import React, { useState, useEffect } from 'react';

// Define the base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

function SideBarRight({ showBetSidebar, selectedBet }) {
  // Local state to store the fighters
  const [fighters, setFighters] = useState([]);

  // useEffect hook to fetch fighters from the API when the component mounts
  useEffect(() => {
    // Asynchronous function to fetch fighters data
    async function fetchFighters() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/fighters`);
        const data = await response.json();
        setFighters(data);
      } catch (error) {
        console.error("Error fetching fighters:", error);
      }
    }

    // Invoke the fetch function
    fetchFighters();
  }, []);  // Dependency array is empty, so this useEffect runs once on mount

  return (
    <div className="p-3 md:w-72 shrink-0 md:sticky md:top-16 shrink-0 h-full">
      <h2 className="text-xl font-semibold">Ranking</h2>
      <ul className="mt-3 space-y-3">
        {/* Check if there are fighters and then render them */}
        {fighters.length > 0 && fighters
          .sort((a, b) => a.rank - b.rank) // Sort fighters by rank
          .slice(0, 5) // Limit to the top 5 fighters
          .map(({ name, handler, image, rank }) => (
            <li className="bg-zinc-800 rounded-md p-2 flex shadow-lg" key={handler}>
              <h1 className="font-semibold text-lg">#{rank} </h1>
              <img
                src={image}
                className="w-12 h-12 rounded-md"
                alt={`top artist ${name}`}
              />
              <div className="ml-3">
                <h3 className="font-semibold">{name}</h3>
                <p className="text-sm text-zinc-400">{handler}</p>
              </div>
            </li>
          ))}
      </ul>
      {/* Promotional section to buy a collection with Ethereum */}
      <div className="w-full rounded-md bg-gradient-to-tr from-fuchsia-600 to-violet-600 mt-3 p-3 relative overflow-hidden">
        <div className="z-10 relative">
          <h2 className="text-white font-semibold">Buy a collection with ethereum</h2>
          <p className="text-white/50 text-sm mt-1 ">
            you can buy a collection of artwork with ethereum very easy and simple
          </p>
          {/* CTA Button */}
          <button className="bg-white w-full rounded-md h-12 text-gray-900 font-semibold mt-2">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

// Exporting the component for use in other parts of the app
export default SideBarRight;