// Import necessary hooks and libraries
import { useState, useEffect } from 'react';
import axios from 'axios';
// Import static image
import DAImage from '../../assets/images/collections/DA.png';

const API_BASE_URL = 'http://127.0.0.1:5000';

// Component to display individual accordion items
const AccordionItem = ({ collection }) => {
  // State to track whether the accordion is open or not
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // Toggle function to open/close the accordion
  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  // Function to handle Stacking Options button click
  const StackOptions = () => {
    console.log("Stacking Options Clicked");
  };

  // Render the accordion item
  return (
    <div key={collection.id}>
    <h2 id={`accordion-collapse-heading-${collection.id}`}>
      <button
        type="button"
        className="mt-4 mb-4 flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={toggleAccordion}
        aria-expanded={isAccordionOpen}
        aria-controls={`accordion-nested-collapse-body-${collection.id}`}
      >
        <div className="flex w-full items-center justify-center">
          <div className="w-1/5">
            <img src={DAImage} alt={collection.name} className="h-4/5" />
            <p>{collection.name}</p>
          </div>
          <div className="p-2 w-1/5 h-40 flex flex-col justify-center">
    <div className="h-1/4">
        <div>{/*Logo of Metafight*/}</div>
        <div>METACREDIT</div>{/*At the top of the parent div*/}
    </div>

    <div className="h-1/4">
        {/*Empty space or content*/}
    </div>

    <div className="h-1/4">
        <div>{/*Logo of Divine assembly*/}</div>
        <div>DA NFT</div> {/*At the bottom of the parent div*/}
    </div>
</div>
          <div className="w-3/5 flex h-4/5 justify-between items-center p-2">
            <div className="flex flex-col ">
              <div>0$</div>
              <p>Claimed rewards</p>
              <button 
                className="bg-gradient-to-tr text-white from-fuchsia-600 to-violet-600 w-full rounded-md font-semibold h-8 p-1 mt-2"
                onClick={StackOptions}
              > 
                  Stack Your NFTs
              </button> 
            </div>
            
            <div className="flex flex-col ">
              <div>0</div>
              <p>Stacked NFTs</p>
              <button 
                className="bg-gradient-to-tr text-white from-fuchsia-600 to-violet-600 w-full rounded-md font-semibold h-8 p-1 mt-2"
                onClick={StackOptions}
              > 
                  Stack Your NFTs
              </button>
            </div>
          </div>
        </div>
        <svg
          data-accordion-icon
          className={`w-3 h-3 rotate-180 shrink-0 ${isAccordionOpen ? 'transform rotate-180' : ''}`}
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
      </button>
    </h2>

      {isAccordionOpen && (
        <div id={`accordion-nested-collapse-body-${collection.id}`} className="flex bg-zinc-800 b-1 rounded-md h-80">
          <div className="w-1/2 m-2 bg-zinc-600 rounded-md p-2">
            {/* Add content for the first half here */}
            <p>Rewards</p>
          </div>
          <div className="w-1/2 m-2 bg-zinc-600 rounded-md p-2">
            {/* Add content for the second half here */}
            <p>Information</p>
          </div>
        </div>
      )}
    </div>
  );
};



    // Main component to display stacking options
const StackingOptions = () => {
    // State to hold collections data
    const [collections, setCollections] = useState([]);
  
    // UseEffect to fetch collection data once the component is mounted
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/collections`)
          .then(res => {
            setCollections(res.data);
          })
          .catch(err => {
            console.error(err);
          });
      }, []);
    
      return (
       <div className='h-4/5 w-full'>
        <div id="accordion-collapse" data-accordion="collapse" className="h-full w-full overflow-y-scroll pr-2">
          {collections.map(collection => (
            <AccordionItem collection={collection} key={collection.id} />
          ))}
        </div>
        </div>
      );
    };
    // Export the main component
export default StackingOptions;