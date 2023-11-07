import React, { useState, useReducer, useContext } from 'react';
//import MFT from '../../../../blockchain/artifacts/contracts/MetaFight.sol/MetaFight.json'
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import BlockchainContext from '../../context/BlockchainContext';
//@TO DO Put real INFURA link
const ipfsClient = create('https://ipfs.infura.io:5001/api/v0');

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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400; // Set the canvas width and height based on your image size
    canvas.height = 400;
  
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };
  
    // Helper function to draw the image if the option is not ''
    const drawOption = async (optionType, optionValue, folder) => {
      if (optionValue && optionValue !== '') {
        const img = await loadImage(`/static/images/${folder}/${optionValue}.png`);
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
      const data = imageDataUrl.split(',')[1];
      const buffer = Buffer.from(data, 'base64');
      
      // Add the image to IPFS
      const result = await ipfsClient.add(buffer);
      
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
  const mint = async () => {
      
        try {
          const combinedImageUrl = await createCombinedImage();
          const ipfsHash = await saveImageToIPFS(combinedImageUrl);
          const imageIPFSUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
          //console.log(`Minting NFT with fighter: ${fighter}, weapon: ${weapon}, name: ${nftName}, price: ${price}, image: ${imageIPFSUrl}`);
          
          // Create NFT metadata
          const metadata = {
            name: nftName,
            description: `A unique character with ${fighter} and ${weapon}`,
            image: imageIPFSUrl,
          };
          
          //Save metadata to IPFS
          const metadataIPFSHash = await saveMetadataToIPFS(metadata);
          const metadataIPFSUrl = `https://ipfs.io/ipfs/${metadataIPFSHash}`;

          let price = ethers.utils.parseEther(state.price.toString())
          let overrides = {
            
            from: accounts[0],
            value: price,
          }

          createPendingRequest();
          const receipt = await mintNFT(price, metadataUrl, overrides);
          await receipt.wait();
          //console.log(`Successfully minted NFT name: ${nftName}, price: ${price}, image: ${imageIPFSUrl}`)
          sendCharacteristicsToServer();
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
    {state.selectedTypes.weaponsType && <img className="absolute" src={`/static/images/weapon/${state.selectedTypes.weaponsType}.png`} alt={state.selectedTypes.weaponsType} />}
    {state.selectedTypes.bodyType && <img className="absolute" src={`/static/images/body/${state.selectedTypes.bodyType}.png`} alt={state.selectedTypes.bodyType} />}
    {state.selectedTypes.headType && <img className="absolute" src={`/static/images/head/${state.selectedTypes.headType}.png`} alt={state.selectedTypes.headType} />}
    {state.selectedTypes.armsType && <img className="absolute" src={`/static/images/arms/${state.selectedTypes.armsType}.png`} alt={state.selectedTypes.armsType} />}
    {state.selectedTypes.torsoType && <img className="absolute" src={`/static/images/torso/${state.selectedTypes.torsoType}.png`} alt={state.selectedTypes.torsoType} />}
    {state.selectedTypes.legsType && <img className="absolute" src={`/static/images/legs/${state.selectedTypes.legsType}.png`} alt={state.selectedTypes.legsType} />}
    {state.selectedTypes.toolsType && <img className="absolute" src={`/static/images/tools/${state.selectedTypes.toolsType}.png`} alt={state.selectedTypes.toolsType} />}
    </div>
      </div>
      <div className="text-center mt-4">
        <p>Total Price: {state.price} ETH</p>
        {/* <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={mintNFT}> */}
        <button  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" >
          Mint NFT
        </button>
      </div>
    </div>
  );
};

export default CharacterGenerator;
