// Import required hooks and libraries
import { useContext, useState, useEffect } from 'react';
import { SelectedCardContext } from '../../../../frontend/src/context/SelectedCardContext';
import FighterSpecs from '../fighterSpecs/FighterSpecs';
// Contexts for authentication and wallet
import AuthContext from '../../context/AuthContext';
import WalletContext from '../../context/WalletContext';
import axios from 'axios';

// Array of predefined colors
const colors = ["green", "yellow", "red", "black", "purple", "white"];
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const TrainingOptions = () => {

    // Access values from the Wallet and Auth contexts
    const { isConnected, connectWallet } = useContext(WalletContext);
    const { isAuthenticated, userId, loginUser } = useContext(AuthContext);
    
    // State to handle the order of the cards
    const [cardOrder, setCardOrder] = useState(colors);
    const { setSelectedCard } = useContext(SelectedCardContext);

    // useEffect hook to fetch the fighters based on user's ID
    useEffect(() => {
        const fetchUserFighters = async () => {
            // Check if user is authenticated and if a userId exists
            if(isAuthenticated && userId) {
                try {
                    // API call to fetch fighters associated with the user
                    const response = await axios.get(`${API_BASE_URL}/api/Usersfighters/${userId}`);
                    // Update the cardOrder state with fetched fighters
                    setCardOrder(response.data);
                } catch (error) {
                    console.log('API call failed with error:', error);
                }
            }
        };
        fetchUserFighters();
    }, [isAuthenticated, userId]);

    // Function to change the card displayed
    const changeCard = () => {
        const newOrder = [cardOrder[cardOrder.length-1], ...cardOrder.slice(0, -1)];
        setCardOrder(newOrder);
        setSelectedCard(newOrder[0]);
    };

    // Placeholder function for staking logic
    const Stake = () => {
        console.log("Stake Clicked");
    };

    // Placeholder function for unstaking logic
    const Unstake = () => {
        console.log("Unstake Clicked");
    };

    // Render the Training Options component
    return (
        <div className='h-4/5 w-4/5'>
            <div className="flex relative h-4/5 w-4/5 items-center justify-center" onClick={changeCard}>
                {/* Mapping through each fighter/card and displaying them */}
                {cardOrder.map((fighter, index) => (
                    <div 
                        key={fighter.id} 
                        className={`w-full h-full absolute rounded-lg transform transition-all duration-500 ease-in-out`}
                        style={{top: `${-4*index}px`, left: `${-4*index}px` , zIndex: `${cardOrder.length - index}`}}
                    >
                        <div className="relative mt-3 pb-3/4 bg-gray-200 rounded-lg shadow-lg">
                            {/* Display fighter specs */}
                            <FighterSpecs/>
                        </div>
                        <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
                        <div className="bg-zinc-800 p-3 rounded-b-lg flex justify-between items-center">
                            <button onClick={Stake} className="w-2/5 py-2 text-center font-medium hover:bg-gray-200 hover:text-blue-700 rounded-lg">Stake</button>
                            <button onClick={Unstake} className="w-2/5 py-2 text-center text-white font-medium bg-gray-700 rounded-lg hover:bg-blue-700">Unstake</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Export the TrainingOptions component
export default TrainingOptions;