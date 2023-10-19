// Import required hooks and libraries
import { useContext, useState, useEffect } from 'react';
import { SelectedCardContext } from '../../../../frontend/src/context/SelectedCardContext';
import FighterSpecsTraining from '../fighterSpecsTraining/fighterSpecsTraining';
// Contexts for authentication and wallet
import UnifiedContext from '../../context/UnifiedContext';
import axios from 'axios';

// Array of predefined colors
const colors = ["green", "yellow", "red", "black", "purple", "white"];
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const TrainingOptions = () => {

    // To take out and replace with with unified provider
    const { isConnected, connectWallet, isAuthenticated, userId, loginUser } = useContext(UnifiedContext);

    
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
                    //const response = await axios.get(`${API_BASE_URL}/api/users_fighters_address/${userWalletAddress}`);
                    // Update the cardOrder state with fetched fighters
                   // setCardOrder(response.data);
                } catch (error) {
                    console.log('API call failed with error:', error);
                }
            }else{
                alert('you need to be connected to work this page')
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
        <div className=' ml-1/5 h-4/5 w-4/5'>
            <div className="flex relative items-center justify-center" onClick={changeCard}>
                {/* Mapping through each fighter/card and displaying them */}
                {cardOrder.map((fighter, index) => (
                    <div 
                        key={fighter.id} 
                        className={`w-full h-full absolute rounded-lg transform transition-all duration-500 ease-in-out`}
                        style={{ top: '50%', 
                        left: '50%', 
                        transform: `translate(-50%, -50%) translateX(-${4*index}px) translateY(-${4*index}px)`, 
                        zIndex: `${cardOrder.length - index}`}}
                    >
                        <div className="relative mt-3 pb-3/4 bg-gray-200 rounded-lg shadow-lg">
                            {/* Display fighter specs */}
                            <FighterSpecsTraining/>
                        </div>
                      
                    </div>
                ))}
            </div>
        </div>
    );
}

// Export the TrainingOptions component
export default TrainingOptions;