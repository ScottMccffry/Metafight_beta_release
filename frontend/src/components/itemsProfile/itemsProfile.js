import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Note by the developer regarding a potential problem with listening to NFT trades on other platforms
//J'AI UN PROBLÈME ICI, SI LES MECS TRADE LEUR NFT SUR UNE AUTRE PLATEFORME, JE DOIS POSER UN EVENT LISTENER SUR LE CONTRAT

// Constants for the API's base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL


// `ItemsProfile` component definition. It receives `userData` as a prop.
function ItemsProfile({userData}) {
  // State for the NFTs
  const [nfts, setNfts] = useState([]);
  // List of target collections the developer wishes to consider
  const targetCollections = ['Desired Collection 1', 'Desired Collection 2'];
  const [usersFighters, setUsersFighters]= useState(null)

  // Effect hook to fetch NFTs related to the user on component mount or when `userData` changes.
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const responseFighters = await axios.get(`${API_BASE_URL}/api/users_fighters_address/${userData.walletAdress}`);
        setNfts(responseFighters.data);  // Populate the NFTs state with the fetched data
      } catch (error) {
        console.log('error', error); // Log any errors that may arise
      }
    };
    fetchNFTs();
  }, [userData]);

  // Render the component
  return (
    <div className="p-6 flex flex-wrap justify-center h-90 bg-zinc-900">
      {/* Iterate over each NFT to display them */}
      {nfts.map(({ id, name, collection, image, rank, nft_address, game_characteristics, handler }) => (
        <div key={id} className="border-2 border-zinc-600 m-4 overflow-hidden rounded-lg shadow-lg relative transition-transform transform hover:-translate-y-2 h-96" style={{ width: 300 }}>
          {/* Image of the NFT */}
          <img alt="fighter" className="w-full" src={image} />
          {/* NFT details overlay */}
          <div className="absolute bottom-[-30%] left-0 right-0 bg-black bg-opacity-0 hover:-translate-y-[50%] hover:bg-opacity-50 transition-all duration-2500">
            <div className="px-6 py-4">
              <div className="mb-2">
                <div className="flex justify-between items-center">
                  {/* NFT's name */}
                  <span className="font-bold text-xl mb-2 text-white">{name}</span>
                  {/* NFT's icon (hardcoded) */}
                  <img src="https://i.imgur.com/7D7I6dI.png" className="w-10 h-10 rounded-full" alt="" />
                </div>
                <p className="text-grey-darker text-base">
                  {/* Uncomment this part to display each game characteristic. 
                  {game_characteristics.map((characteristic, index) => (
                    <span key={index} className="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">{characteristic}</span>
                  ))} */}
                  {/* Currently, it only displays game_characteristics without iterating */}
                  <span className="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">{game_characteristics}</span>
                </p>
                {/* Collection name */}
                <div className="px-6 pt-4 pb-2">
                  <span className="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">{collection}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Export the component
export default ItemsProfile;
