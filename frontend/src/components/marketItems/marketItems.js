import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown';
import { SocketContext } from '../../context/SocketContext'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
// Component for individual market items
function MarketItem({ marketplace_item = {}, fighter = {}, onBidClick}) {
    const navigate = useNavigate();
    // Destructuring properties from the passed props
    const { price, timeLeft, nft_address, id } = marketplace_item;
    const { owner, game_characteristics, image, name } = fighter;
    const socket = useContext(SocketContext);

  
    // Handler for when the bid button is clicked
    const handleItemBidClick = (event, ItemBid) => {
      event.stopPropagation();
      console.log("BID OBJECT: ", ItemBid);
      if (onBidClick) {
        onBidClick(ItemBid);
      }
    };
  
    // Handler for viewing the NFT artwork
    const handleViewArtworkClick = () => {
      navigate(`/nft/${nft_address}`);
    };
  
    // Render the component
    return (
    <li className="w-full lg:w-1/2 xl:w-1/3 p-1.5">
      <div
        className="block bg-zinc-800 rounded-md w-full overflow-hidden pb-4 shadow-lg"  >
        <div
          className="w-full h-40 bg-center bg-cover relative"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-5/6 bg-white rounded-md flex items-center bg-opacity-30 backdrop-blur-md">
            <div className="w-1/2 p-3">
              <h3 className="font-semibold">Current Bid</h3>
              <div className="">{marketplace_item.price} ETH</div>
            </div>
            <div className="w-1/2 p-3">
              <h3 className="font-semibold">Ending in</h3>
              <Countdown
                date={Date.now() + marketplace_item.timeLeft}
                renderer={({ hours, minutes, seconds }) => (
                  <div className="">{`${hours}h: ${minutes}m: ${seconds}s`}</div>
                )}
              />
            </div>
          </div>
        </div>
        <h3 className="font-semibold text-lg px-3 mt-2">{fighter.name}</h3>
        <div className="flex mt-2">
          <div className="p-3 w-1/2">
            <button className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-full h-12 rounded-md font-semibold"  onClick={(event) => { 
    console.log("Button clicked"); 
    handleItemBidClick(event, {itemId: id, selectedItemName: fighter.name, marketplace_item_nft_address : marketplace_item.nft_address, bid: marketplace_item.price, time_left: marketplace_item.timeLeft })}}>
              Place a bid
            </button>
          </div>
          <div className="p-3 w-1/2">
            <button 
              className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-full rounded-md font-semibold h-12 p-px"
             onClick={handleViewArtworkClick}
            >
              <div className="bg-zinc-800 w-full h-full rounded-md grid place-items-center">
                View artwork
              </div>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

// Component for a list of market items
function MarketItems({ onBidClick}) {
    const [marketItems, setMarketItems] = useState([]);
    const socket = useContext(SocketContext);

    // Socket effect for listening to bid updates
    useEffect(() => {
      console.log('MarketItems useEffect hook ran with socket:', socket);
  
      // Set up a socket listener for live bid updates if the socket is available
      if (socket) {
        console.log('Setting up update event listener');
        
        socket.on('update_live_bid', (data) => {
          console.log('Update event received with data:', data);
          console.log('Data nft address:', data.nft_address);
          console.log('Data bid:', data.bid_value);
        
          // Update the market items with new bid values
          setMarketItems((currentMarketItems) => 
            currentMarketItems.map((marketItem) => {
              console.log('Current marketItem:', marketItem);
              if (marketItem.nft_address === data.nft_address) {
                console.log('Updating item:', marketItem.nft_address);
                return {...marketItem, price: data.bid_value};
              } else {
                return marketItem;
              }
            })
          );
        
          console.log('Updated fights:', marketItems);
        });
  
        // Clean up the socket listener on component unmount
        return () => {
          if (socket) {
            socket.off('update');
            console.log('Removed update event listener');
          }
        };
      }
    }, [socket]);
  
    // Effect to fetch market items on component mount
    useEffect(() => {
      async function fetchMarketItems() {
        try {
          // Fetching market items and fighters data
          const responseItems = await fetch(`${API_BASE_URL}/api/marketItems`);
          const items = await responseItems.json();
          const responseFighters = await fetch(`${API_BASE_URL}/api/fighters`);
          const fighters = await responseFighters.json();
  
          // Combining market items with their respective fighters
          const combinedMarketItems = items.map(item => {
            const fighter = fighters.find(fighter => fighter.nft_address === item.nft_address);
            return { ...item, fighter };
          });
    
          setMarketItems(combinedMarketItems);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    
      fetchMarketItems();
    }, []);
  
    // Render the component

  return (
    <ul className="p-1.5 flex flex-wrap">
      {marketItems.length > 0 ? (
       marketItems.map((marketItem, index) =>
       <MarketItem key={marketItem.id} marketplace_item={marketItem} fighter={marketItem.fighter} onBidClick={onBidClick} />
      )
      ) : (
        <p>Loading data...</p>
      )}
    </ul>
  );
}


export default MarketItems;
