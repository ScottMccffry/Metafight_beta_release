// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

import ContentProfile from '../../components/contents/contentProfile/contentProfile';
import ItemsProfile from '../../components/itemsProfile/itemsProfile';

// Define the base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

// Create the Profile component
const Profile = () => {
  // Extract route parameters and location information
  const location = useLocation();
  const { walletAddress } = useParams();
  const userDataIn = location.state?.userData || null;
  
  // Define state variable for user data using the useState hook
  const [userData, setUserData] = useState(userDataIn);

  // useEffect hook to fetch user data when the component mounts or walletAddress changes
  useEffect(() => {
    // Check if userData is not available, then fetch it
    if (!userData) {
      const fetchUserData = async () => {
        try {
          // Send a GET request to fetch user data using the walletAddress
          const result = await axios.get(`${API_BASE_URL}/api/user/profile/${walletAddress}`);
          // Update the state with the fetched user data
          setUserData(result.data);
        } catch (error) {
          console.error(`Error fetching user data: ${error}`);
        }
      };

      // Call the fetchUserData function when walletAddress or userData changes
      fetchUserData();
    }
  }, [walletAddress, userData]);

  // Render the Profile component
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-48 hidden lg:block shrink-0" />
      <div className="grow ">
        {/* Pass user data to the ContentProfile and ItemsProfile components */}
        <ContentProfile userData={userData} />
        <ItemsProfile userData={userData} />
      </div>
    </div>
  );
};

// Export the Profile component
export default Profile;
