import React, { useState } from 'react';
import MFT from '../../artifacts/contracts/MetaFight.sol/MetaFight.json'
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';


const CharacterGenerator = () => {
  //type of characteristics
  const [nftName, setNftName] = useState('');
  const [fighter, setFighter] = useState('');
  const [weapon, setWeapon] = useState('');
  const [color, setColor] = useState('');
  const [error, setError] = useState(null);
  const MFTaddress ='0x5FbDB2315678afecb367f032d93F642f64180aa3' 

  //json format for database characteristics
  const [characteristics, setCharacteristics] = useState({});
  // State variables to manage accordion sections
  const [isBodyOpen, setBodyOpen] = useState(false);
  const [isHeadOpen, setHeadOpen] = useState(false);
  const [isArmsOpen, setArmsOpen] = useState(false);
  const [isTorsoOpen, setTorsoOpen] = useState(false);
  const [isLegsOpen, setLegsOpen] = useState(false);
  const [isToolsOpen, setToolsOpen] = useState(false);
  const [isWeaponsOpen, setWeaponsOpen] = useState(false);

  const handleBodyAccordionToggle = () => setBodyOpen(!isBodyOpen);
  const handleHeadAccordionToggle = () => setHeadOpen(!isHeadOpen);
  const handleArmsAccordionToggle = () => setArmsOpen(!isArmsOpen);
  const handleTorsoAccordionToggle = () => setTorsoOpen(!isTorsoOpen);
  const handleLegsAccordionToggle = () => setLegsOpen(!isLegsOpen);
  const handleToolsAccordionToggle = () => setToolsOpen(!isToolsOpen);
  const handleWeaponsAccordionToggle = () => setWeaponsOpen(!isWeaponsOpen);
  const [bodyType, setBodyType] = useState('defaultValue');
  const handleBodyTypeChange = (event) => {
    setBodyType(event.target.value);
    setCharacteristics((prevCharacteristics) => ({
      ...prevCharacteristics,
      bodyType: event.target.value,
    }));
    updatePrice();
  };

  const [headType, setHeadType] = useState('defaultValue');
  const handleHeadTypeChange = (event) => {
    setHeadType(event.target.value);
    setCharacteristics((prevCharacteristics) => ({
      ...prevCharacteristics,
      headType: event.target.value,
    }));
    updatePrice();
  };

  const [armsType, setArmsType] = useState('defaultValue');
  const handleArmsTypeChange = (event) => {
    setArmsType(event.target.value);
    setCharacteristics((prevCharacteristics) => ({
      ...prevCharacteristics,
      armsType: event.target.value,
    }));
    updatePrice();
  };

  const [torsoType, setTorsoType] = useState('defaultValue');
  const handleTorsoTypeChange = (event) => {
    setTorsoType(event.target.value);
    setCharacteristics((prevCharacteristics) => ({
      ...prevCharacteristics,
      torsoType: event.target.value,
    }));
    updatePrice();
  };

  const [legsType, setLegsType] = useState('defaultValue');
  const handleLegsTypeChange = (event) => {
    setLegsType(event.target.value);
    setCharacteristics((prevCharacteristics) => ({
      ...prevCharacteristics,
      legsType: event.target.value,
    }));
    updatePrice();
  };

  const [toolsType, setToolsType] = useState('defaultValue');
  const handleToolsTypeChange = (event) => {
    setToolsType(event.target.value);
    setCharacteristics((prevCharacteristics) => ({
      ...prevCharacteristics,
      toolsType: event.target.value,
    }));
    updatePrice();
  };

  const [weaponsType, setWeaponsType] = useState('defaultValue');
  const handleWeaponsTypeChange = (event) => {
    setWeaponsType(event.target.value);
    setCharacteristics((prevCharacteristics) => ({
      ...prevCharacteristics,
      weaponsType: event.target.value,
    }));
    updatePrice();
  };


  // Event handlers...
  const [price, setPrice] = useState(0);
  const ipfs = create({
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
  });

  const handleNftNameChange = (event) => {
    setNftName(event.target.value);
  };

  const updatePrice = () => {
    const basePrice = 0.05;
    const fighterPrice = fighter !== 'defaultValue' ? 1 : 0;
    const weaponPrice = weaponsType !== 'defaultValue' ? 1 : 0;
    const bodyTypePrice = bodyType !== 'defaultValue' ? 1 : 0;
    const headTypePrice = headType !== 'defaultValue' ? 1 : 0;
    const armsTypePrice = armsType !== 'defaultValue' ? 1 : 0;
    const torsoTypePrice = torsoType !== 'defaultValue' ? 1 : 0;
    const legsTypePrice = legsType !== 'defaultValue' ? 1 : 0;
    const toolsTypePrice = toolsType !== 'defaultValue' ? 1 : 0;
    
    setPrice(
      basePrice +
      fighterPrice +
      weaponPrice +
      bodyTypePrice +
      headTypePrice +
      armsTypePrice +
      torsoTypePrice +
      legsTypePrice +
      toolsTypePrice
    );
  };
  
const sendCharacteristicsToServer = async () => {
  try {
    const response = await fetch('/api/create-fighter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(characteristics),
    });

    if (!response.ok) {
      throw new Error('Failed to send the characteristics to the server');
    }

    const result = await response.json();
    console.log('Characteristics sent successfully:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

const createCombinedImage = async () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 400; // Set the canvas width and height based on your image size
  canvas.height = 400;

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  };

  if (fighter) {
    const fighterImg = await loadImage(`../../assets/character/${fighter}.png`);
    ctx.drawImage(fighterImg, 0, 0);
  }
  
  if (weapon) {
    const weaponImg = await loadImage(`../../assets/weapon/${weapon}.png`);
    ctx.drawImage(weaponImg, 0, 0);
  }

  const combinedImageUrl = canvas.toDataURL('image/png');
  return combinedImageUrl;
};

const mintNFT = async () => {
  if(typeof window.ethereum !== 'undefined') {
    let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(MFTaddress, MFT.abi, signer);
    try {
      const combinedImageUrl = await createCombinedImage();

      //const ipfsHash = await saveImageToIPFS(combinedImageUrl);
      //const imageIPFSUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
      //console.log(`Minting NFT with fighter: ${fighter}, weapon: ${weapon}, name: ${nftName}, price: ${price}, image: ${imageIPFSUrl}`);
      
      // Create NFT metadata
      const metadata = {
        name: nftName,
        description: `A unique character with ${fighter} and ${weapon}`,
        //image: imageIPFSUrl,
      };
      
      //Save metadata to IPFS
      //const metadataIPFSHash = await saveMetadataToIPFS(metadata);

      let overrides = {
        
        from: accounts[0],
        //value: data.cost
      }
      const transaction = await contract.mint(accounts[0], 1, overrides);
      await transaction.wait();
      //console.log(`Successfully minted NFT name: ${nftName}, price: ${price}, image: ${imageIPFSUrl}`)
      sendCharacteristicsToServer();
    }
    catch(err) {
      setError(err.message);
    }
  }



 
  
  // Interact with your smart contract to mint the NFT and include the metadata
  // Add your smart contract interaction code 
};
  // Function to toggle the open/close status of the Fighter accordion
  

  // JSX content for the Fighter accordion section
  
  const bodyAccordionContent = (
    <div id="accordion-nested-collapse-body-body" data-accordion="collapse">
      {['Body type', 'Shadow', 'Body color', 'Special', 'Wounds', 'Prostheses', 'Lizard'].map((option) => (
        <label className="block mb-2" key={option}>
          <input
            type="radio"
            name="bodyType"
            value={option}
            checked={bodyType === option}
            onChange={handleBodyTypeChange}
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  );

  const headAccordionContent = (
    <div id="accordion-nested-collapse-body-head" data-accordion="collapse">
      {[
        'Heads', 'Ears', 'Nose', 'Eyes', 'Wrinkles', 'Beards', 'Hair', 'Appendages',
        'Head coverings', 'Hats and Helmets', 'Accessories', 'Neck'
      ].map((option) => (
        <label className="block mb-2" key={option}>
          <input
            type="radio"
            name="headType"
            value={option}
            checked={headType === option}
            onChange={handleHeadTypeChange}
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  );

  const armsAccordionContent = (
    <div id="accordion-nested-collapse-body-arms" data-accordion="collapse">
      {['Shoulders', 'Armour', 'Bauldron', 'Wrists', 'Gloves'].map((option) => (
        <label className="block mb-2" key={option}>
          <input
            type="radio"
            name="armsType"
            value={option}
            checked={armsType === option}
            onChange={handleArmsTypeChange}
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  );

  const torsoAccordionContent = (
    <div id="accordion-nested-collapse-body-torso" data-accordion="collapse">
      {[
        'Shirts', 'Aprons', 'Bandages', 'Chainmail', 'Jacket', 'Vest', 'Armour',
        'Cape', 'Waist'
      ].map((option) => (
        <label className="block mb-2" key={option}>
          <input
            type="radio"
            name="torsoType"
            value={option}
            checked={torsoType === option}
            onChange={handleTorsoTypeChange}
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  );

  const legsAccordionContent = (
    <div id="accordion-nested-collapse-body-legs" data-accordion="collapse">
      {['Legs', 'Boots', 'Shoes'].map((option) => (
        <label className="block mb-2" key={option}>
          <input
            type="radio"
            name="legsType"
            value={option}
            checked={legsType === option}
            onChange={handleLegsTypeChange}
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  );

  const toolsAccordionContent = (
    <div id="accordion-nested-collapse-body-tools" data-accordion="collapse">
      {['Rod', 'Smash', 'Thrust', 'Whip'].map((option) => (
        <label className="block mb-2" key={option}>
          <input
            type="radio"
            name="toolsType"
            value={option}
            checked={toolsType === option}
            onChange={handleToolsTypeChange}
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  );

  const weaponsAccordionContent = (
    <div id="accordion-nested-collapse-body-weapons" data-accordion="collapse">
      {[
        'Shield', 'Quiver', 'Ranged', 'Sword', 'Blunt', 'Polearm',
        'Magic', 'Misc', 'Preview', 'Walk'
      ].map((option) => (
        <label className="block mb-2" key={option}>
          <input
            type="radio"
            name="weaponsType"
            value={option}
            checked={weaponsType === option}
            onChange={handleWeaponsTypeChange}
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  );
 
  
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
  return (
    <div className="text-white bg-transparent p-4">
      <div className="mb-4">
        <label htmlFor="nftName" className="block mb-2">NFT Name:</label>
        <input
          type="text"
          id="nftName"
          value={nftName}
          onChange={handleNftNameChange}
          className="w-1/2 px-3 py-2 bg-gray-800 text-white border rounded"
        />
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
          <div id="accordion-collapse" data-accordion="collapse">
            {/* Body Accordion */}
    <h2>
      <button
        type="button"
        className={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 rounded-xl ml-0 m-2 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${isBodyOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        onClick={handleBodyAccordionToggle}
        aria-expanded={isBodyOpen}
      >
        <span>Body</span>
        <AccordionIcon isOpen={isBodyOpen} />
      </button>
    </h2>
    {isBodyOpen && bodyAccordionContent}

    {/* Head Accordion */}
    <h2>
      <button
        type="button"
        className={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 rounded-xl ml-0 m-2 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${isHeadOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        onClick={handleHeadAccordionToggle}
        aria-expanded={isHeadOpen}
      >
        <span>Head</span>
        <AccordionIcon isOpen={isHeadOpen} />
      </button>
    </h2>
    {isHeadOpen && headAccordionContent}

    {/* Arms Accordion */}
    <h2>
      <button
        type="button"
        className={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 rounded-xl ml-0 m-2 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${isArmsOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        onClick={handleArmsAccordionToggle}
        aria-expanded={isArmsOpen}
      >
        <span>Arms</span>
        <AccordionIcon isOpen={isArmsOpen} />
      </button>
    </h2>
    {isArmsOpen && armsAccordionContent}

    {/* Torso Accordion */}
    <h2>
      <button
        type="button"
        className={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 rounded-xl ml-0 m-2 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${isTorsoOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        onClick={handleTorsoAccordionToggle}
        aria-expanded={isTorsoOpen}
      >
        <span>Torso</span>
        <AccordionIcon isOpen={isTorsoOpen} />
      </button>
    </h2>
    {isTorsoOpen && torsoAccordionContent}

    {/* Legs Accordion */}
    <h2>
      <button
        type="button"
        className={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 rounded-xl ml-0 m-2 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${isLegsOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        onClick={handleLegsAccordionToggle}
        aria-expanded={isLegsOpen}
      >
        <span>Legs</span>
        <AccordionIcon isOpen={isLegsOpen} />
      </button>
    </h2>
    {isLegsOpen && legsAccordionContent}

    {/* Tools Accordion */}
    <h2>
      <button
        type="button"
        className={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 rounded-xl ml-0 m-2 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${isToolsOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        onClick={handleToolsAccordionToggle}
        aria-expanded={isToolsOpen}
      >
        <span>Tools</span>
        <AccordionIcon isOpen={isToolsOpen} />
      </button>
    </h2>
    {isToolsOpen && toolsAccordionContent}

    {/* Weapons Accordion */}
    <h2>
      <button
        type="button"
        className={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 rounded-xl ml-0 m-2 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${isWeaponsOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        onClick={handleWeaponsAccordionToggle}
        aria-expanded={isWeaponsOpen}
      >
        <span>Weapons</span>
        <AccordionIcon isOpen={isWeaponsOpen} />
      </button>
    </h2>
    {isWeaponsOpen && weaponsAccordionContent}
        </div>
        </div>
        <div className="w-1/2 relative ml-3">
    {/* Add the superposed layers here */}
    {weaponsType && <img className="absolute" src={`/static/images/weapon/${weaponsType}.png`} alt={weaponsType} />}
    {bodyType && <img className="absolute" src={`/static/images/body/${bodyType}.png`} alt={bodyType} />}
    {headType && <img className="absolute" src={`/static/images/head/${headType}.png`} alt={headType} />}
    {armsType && <img className="absolute" src={`/static/images/arms/${armsType}.png`} alt={armsType} />}
    {torsoType && <img className="absolute" src={`/static/images/torso/${torsoType}.png`} alt={torsoType} />}
    {legsType && <img className="absolute" src={`/static/images/legs/${legsType}.png`} alt={legsType} />}
    {toolsType && <img className="absolute" src={`/static/images/tools/${toolsType}.png`} alt={toolsType} />}
</div>
      </div>
      <div className="text-center mt-4">
        <p>Total Price: {price} ETH</p>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={mintNFT}>
          Mint NFT
        </button>
      </div>
    </div>
  );
};

export default CharacterGenerator;
