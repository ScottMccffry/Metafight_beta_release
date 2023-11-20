import React, { useState, useReducer, useContext } from 'react';
//import MFT from '../../../../blockchain/artifacts/contracts/MetaFight.sol/MetaFight.json'
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import BlockchainContext from '../../context/BlockchainContext';
import UnifiedContext from '../../context/UnifiedContext';
import axios from 'axios';
//@TO DO Put real INFURA link
const ipfsClient = create('https://ipfs.infura.io:5001/api/v0');
const baseLayerPath = process.env.REACT_APP_SPRITES_PATH;


const Options = {
  bodyOptions: ['Body type', 'Shadow', 'Body color', 'Special', 'Wounds', 'Prostheses', 'Lizard'],
  headOptions: ['Heads', 'Ears', 'Nose', 'Eyes', 'Wrinkles', 'Beards', 'Hair', 'Appendages', 'Head coverings', 'Hats and Helmets', 'Accessories', 'Neck'],
  armsOptions: ['Shoulders', 'Armour', 'Bauldron', 'Wrists', 'Gloves'],
  torsoOptions: ['Shirts', 'Aprons', 'Bandages', 'Chainmail', 'Jacket', 'Vest', 'Armour', 'Cape', 'Waist'],
  legsOptions: ['Legs', 'Boots', 'Shoes'],
  toolsOptions: ['Rod', 'Smash', 'Thrust', 'Whip'],
  weaponsOptions: ['Shield', 'Quiver', 'Ranged', 'Sword', 'Blunt', 'Polearm', 'Magic', 'Misc', 'Preview', 'Walk']
};

// Define the initial state for the reducer
const initialState = {
  nftName: '',
  characteristics: {},
  accordionStates: {
    isBodyOpen: false,
    isHeadOpen: false,
    isArmsOpen: false,
    isTorsoOpen: false,
    isLegsOpen: false,
    isToolsOpen: false,
    isWeaponsOpen: false,
  },
  selectedTypes: {
    bodyType: '',
    headType: '',
    armsType: '',
    torsoType: '',
    legsType: '',
    toolsType: '',
    weaponsType: '',
  },
  price: 0,
  error: null,
};

// Reducer function to manage the state
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'TOGGLE_ACCORDION':
      return {
        ...state,
        accordionStates: {
          ...state.accordionStates,
          [action.section]: !state.accordionStates[action.section],
        },
      };
    case 'SET_CHARACTERISTIC':
      return {
        ...state,
        selectedTypes: {
          ...state.selectedTypes,
          [action.characteristic]: action.value,
        },
        characteristics: {
          ...state.characteristics,
          [action.characteristic]: action.value,
        },
      };
    case 'UPDATE_PRICE':
      // Recalculate the price based on selectedTypes
      const newPrice = Object.values(state.selectedTypes).reduce(
        (acc, type) => acc + (type !== 'defaultValue' ? 1 : 0),
        0.05
      );
      return {
        ...state,
        price: newPrice,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};





const CharacterGenerator = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { mintNFT } = useContext(BlockchainContext);
  const {
    isAuthenticated,
    userAddress,
   
  } = useContext(UnifiedContext);
  const [error, setError] = useState(null);

  const handleAccordionToggle = (section) => {
    dispatch({ type: 'TOGGLE_ACCORDION', section });
  };

  const handleTypeChange = (event) => {
    const { name, value } = event.target;
    dispatch({ type: 'SET_CHARACTERISTIC', characteristic: name, value });
    dispatch({ type: 'UPDATE_PRICE' }); // This will trigger the price update
  };

  const generateAccordionContent = (type, options) => (
    <div id={`accordion-nested-collapse-body-${type}`} data-accordion="collapse">
      {options.map((option) => (
        <label className="block mb-2" key={option}>
          <input
            type="radio"
            name={`${type}Type`}
            value={option}
            checked={state.selectedTypes[`${type}Type`] === option}
            onChange={(e) => handleTypeChange(e, `${type}Type`)}
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  );

  const accordionItems = [
    { type: 'body',  label: 'Body', isOpen: state.accordionStates.isBodyOpen, toggle: () => handleAccordionToggle('isBodyOpen') },
    { type: 'head', label: 'Head', isOpen: state.accordionStates.isHeadOpen, toggle: () => handleAccordionToggle('isHeadOpen') },
    { type: 'arms', label: 'Arms', isOpen: state.accordionStates.isArmsOpen, toggle: () => handleAccordionToggle('isArmsOpen') },
    { type: 'torso', label: 'Torso', isOpen: state.accordionStates.isTorsoOpen, toggle: () => handleAccordionToggle('isTorsoOpen') },
    { type: 'legs', label: 'Legs', isOpen: state.accordionStates.isLegsOpen, toggle: () => handleAccordionToggle('isLegsOpen') },
    { type: 'tools', label: 'Tools', isOpen: state.accordionStates.isToolsOpen, toggle: () => handleAccordionToggle('isToolsOpen') },
    { type: 'weapons', label: 'Weapons', isOpen: state.accordionStates.isWeaponsOpen, toggle: () => handleAccordionToggle('isWeaponsOpen') },
  ];

  function AccordionIcon({ isOpen }) {
    return (
      <svg
        className={`w-3 h-3 rotate-180 shrink-0 ${isOpen ? 'transform rotate-180' : ''}`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5 5 1 1 5"
        />
      </svg>
    );
  } 

  const renderAccordionItem = ({ type, label, isOpen, toggle }) => {
    const typeOptions = `${type}Options`
    const accordionContent = generateAccordionContent(type, Options[`${type}Options`] || []);
    return (
      <h2 key={type}>
        <button
          type="button"
          className={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 rounded-xl ml-0 m-2 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${isOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          onClick={toggle}
          aria-expanded={isOpen}
        >
          <span>{label}</span>
          <AccordionIcon isOpen={isOpen} />
        </button>
        {isOpen && accordionContent}
      </h2>
    );
  };

  const createCombinedImage = async () => {
    console.log('createcombinedImage 1')
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    console.log('createcombinedImage 2')
    canvas.width = 400; // Set the canvas width and height based on your image size
    canvas.height = 400;
    console.log('createcombinedImage 3')
    const loadImage = (src) => {
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        console.log('ok loadImage')
        img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
        console.log(`${src}`)

        img.src = src; 
      });
    };
  
    // Helper function to draw the image if the option is not ''
    const drawOption = async (optionType, optionValue, folder) => {
      if (optionValue && optionValue !== '') {
        const img = await loadImage(`/assets/images/characterGeneratorSprites/${folder}/${optionValue}.png`);
        ctx.drawImage(img, 0, 0);
      }
    };
  
    // You will need to adjust these paths to match where your images are stored
    await drawOption('bodyType', state.selectedTypes.bodyType, 'body');
    await drawOption('headType', state.selectedTypes.headType, 'head');
    await drawOption('armsType', state.selectedTypes.armsType, 'arms');
    await drawOption('torsoType', state.selectedTypes.torsoType, 'torso');
    await drawOption('legsType', state.selectedTypes.legsType, 'legs');
    await drawOption('toolsType', state.selectedTypes.toolsType, 'tools');
    await drawOption('weaponsType', state.selectedTypes.weaponsType, 'weapons');
  
    const combinedImageUrl = canvas.toDataURL('image/png');
    return combinedImageUrl;
  };
  
  // Function to save an image to IPFS
  const saveImageToIPFS = async (imageDataUrl) => {
    try {
      // Splitting the base64 string and converting it to a binary format
      const data = imageDataUrl.split(',')[1];
      const byteCharacters = atob(data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
  
      // Add the image to IPFS
      const result = await ipfsClient.add(blob);
      
      // Return the IPFS path of the uploaded image
      return result.path;
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      throw new Error('Error uploading image to IPFS');
    }
  };
  // Function to save metadata to IPFS
  const saveMetadataToIPFS = async (metadata) => {
  try {
    // Convert metadata object to a JSON string
    const metadataJson = JSON.stringify(metadata);
    
    // Add the metadata to IPFS
    const result = await ipfsClient.add(metadataJson);
    
    // Return the IPFS path of the uploaded metadata
    return result.path;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Error uploading metadata to IPFS');
  }
  };

  const createPendingRequest = async (pending_data) => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.post('/api/mint_request/', { pending_data });
      console.log('Pending request created:', response.data);
      return response.data.id
    } catch (error) {
      console.error('Error creating pending request:', error);
      throw new Error('Failed to create pending request');
    }
  };

  const generateCharacterDescription = () => {
    // List to hold descriptions of each selected type
    let descriptions = [];
  
    // Check each selected type and create a description part for it
    if (state.selectedTypes.bodyType) {
      descriptions.push(`Body Type: ${state.selectedTypes.bodyType}`);
    }
    if (state.selectedTypes.headType) {
      descriptions.push(`Head Type: ${state.selectedTypes.headType}`);
    }
    if (state.selectedTypes.armsType) {
      descriptions.push(`Arms Type: ${state.selectedTypes.armsType}`);
    }
    if (state.selectedTypes.torsoType) {
      descriptions.push(`Torso Type: ${state.selectedTypes.torsoType}`);
    }
    if (state.selectedTypes.legsType) {
      descriptions.push(`Legs Type: ${state.selectedTypes.legsType}`);
    }
    if (state.selectedTypes.toolsType) {
      descriptions.push(`Tools: ${state.selectedTypes.toolsType}`);
    }
    if (state.selectedTypes.weaponsType) {
      descriptions.push(`Weapon: ${state.selectedTypes.weaponsType}`);
    }
  
    // Combine all descriptions into a single string
    return descriptions.length > 0 ? `A unique character with ${descriptions.join(', ')}` : 'A unique character';
  };

  const mint = async (nftName) => {
      
        try {
          if (!userAddress) {
            console.error('Wallet is not connected.');
            return;
          }
          console.log('mint initiated')
          const combinedImageUrl = await createCombinedImage();
          console.log('mint ok0')
          const ipfsHash = await saveImageToIPFS(combinedImageUrl);
          console.log('mint ok1')
          const imageIPFSUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
          //console.log(`Minting NFT with fighter: ${fighter}, weapon: ${weapon}, name: ${nftName}, price: ${price}, image: ${imageIPFSUrl}`);
          const characterDescription = generateCharacterDescription();
          console.log('mint ok2')
          // Create NFT metadata
          const metadata = {
            name: nftName,
            description: characterDescription,
            image: imageIPFSUrl,
          };
          
          //Save metadata to IPFS
          const metadataIPFSHash = await saveMetadataToIPFS(metadata);
          const metadataIPFSUrl = `https://ipfs.io/ipfs/${metadataIPFSHash}`;

          let price = ethers.parseEther(state.price.toString())
          let overrides = {
            
            from: userAddress,
            value: price,
          }
          // Prepare the fighter data to be sent to the backend
          const fighterData = {
            name: nftName, // The name of the NFT
            collection_address: 'COLLECTION_ADDRESS_HERE', // Placeholder for collection address
            image: imageIPFSUrl, // URL of the image on IPFS
            owner_nft_address: 'OWNER_NFT_ADDRESS_HERE', // Placeholder for owner's NFT address
            // The NFT address will be available after minting, so initially, it can be empty or a placeholder
            nft_address: 'NFT_ADDRESS_TO_BE_UPDATED_AFTER_MINTING',
            // You may want to include the entire metadata or specific parts of it
            game_characteristics_json: JSON.stringify(metadata),
            handler: 'HANDLER_INFORMATION_HERE', // Placeholder for handler information
            rank: 'RANK_INFORMATION_HERE', // Placeholder for rank information
            // Add any other relevant fields that are required for the fighter
          };

          const pending_id = createPendingRequest(fighterData);
          console.log('mint ok3')
          const receipt = await mintNFT(price, metadataIPFSUrl, pending_id, overrides);
          await receipt.wait();
          console.log(`Successfully minted NFT name: ${nftName}, price: ${price}, image: ${imageIPFSUrl}`)
          console.log('waiting for confirmation to pending DB')
        }
        catch(err) {
          setError(err.message);
        }
    };
    
    
    // Interact with your smart contract to mint the NFT and include the metadata
    // Add your smart contract interaction code 

  return (
    <div className="text-white bg-transparent p-4">
      <div className="mb-4">
        <label htmlFor="nftName" className="block mb-2">NFT Name:</label>
        <input
          type="text"
          id="nftName"
          value={initialState.nftName}
          //onChange={handleNftNameChange}
          className="w-1/2 px-3 py-2 bg-gray-800 text-white border rounded"
        />
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
        <div id="accordion-collapse" data-accordion="collapse">
          {accordionItems.map(renderAccordionItem)}
        </div>
        </div>
        <div className="w-1/2 relative ml-3">
          
    {/* Add the superposed layers here */}
    {state.selectedTypes.weaponsType && <img className="absolute" src={`/assets/images/characterGeneratorSprites/weapon/${state.selectedTypes.weaponsType}.png`} alt={state.selectedTypes.weaponsType} />}
    {state.selectedTypes.bodyType && <img className="absolute" src={`/assets/images/characterGeneratorSprites/body/${state.selectedTypes.bodyType}.png`} alt={state.selectedTypes.bodyType} />}
    {state.selectedTypes.headType && <img className="absolute" src={`/assets/images/characterGeneratorSprites/head/${state.selectedTypes.headType}.png`} alt={state.selectedTypes.headType} />}
    {state.selectedTypes.armsType && <img className="absolute" src={`/assets/images/characterGeneratorSprites/arms/${state.selectedTypes.armsType}.png`} alt={state.selectedTypes.armsType} />}
    {state.selectedTypes.torsoType && <img className="absolute" src={`/assets/images/characterGeneratorSprites/torso/${state.selectedTypes.torsoType}.png`} alt={state.selectedTypes.torsoType} />}
    {state.selectedTypes.legsType && <img className="absolute" src={`/assets/images/characterGeneratorSprites/legs/${state.selectedTypes.legsType}.png`} alt={state.selectedTypes.legsType} />}
    {state.selectedTypes.toolsType && <img className="absolute" src={`/assets/images/characterGeneratorSprites/tools/${state.selectedTypes.toolsType}.png`} alt={state.selectedTypes.toolsType} />}
    </div>
      </div>
      <div className="text-center mt-4">
        <p>Total Price: {state.price} ETH</p>
        {/* <button  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" > */}
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={mint}>
        
          Mint NFT
        </button>
      </div>
    </div>
  );
};

export default CharacterGenerator;
