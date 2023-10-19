// Importing necessary modules and components
import React from 'react';
import SidebarItem from '../sideBarItem/sideBarItem.js';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import UnifiedContext from '../../context/UnifiedContext.js';
// Setting the API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

// Defining Icons object with SVG paths for logout icon
const Icons = {
  logout: () => (
    <path
      fillRule="evenodd"
      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
      clipRule="evenodd"
    />
  ),
};

function SidebarLeft() {
  // Using the useLocation hook to get the current URL location
  const location = useLocation();
  // Destructuring logoutUser from AuthContext
  const { logoutUser } = useContext(UnifiedContext);

  // Check if the provided link matches the current URL pathname
  const isActive = (link) => location.pathname === link;

  // Handling the logout process
  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/logout`);
      if(response.data.message === 'Logout successful') {
        logoutUser(); // Logout function from AuthContext
      }
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  return (
    // Creating a sidebar container
    <div className="hidden lg:flex h-screen flex-col justify-between w-48 fixed left-0 top-0 bottom-0 pt-24">
      <ul className="space-y-8">
        {/* Mapping through the sidebar items and rendering them */}
        {[
          { key: 'dashboard', link: '/' },
          { key: 'market', link: '/marketplace' },
          { key: 'live', link: '/live-feed' },
          { key: 'mint', link: '/mint' },
          { key: 'training', link: '/training' },
          { key: 'stacking', link: '/stacking' },
          { key: 'wallet', link: '/wallet' },
          { key: 'settings', link: '/settings' },
        ].map(({ key, link }, index) => (
          <li key={key}>
            <Link to={link}>
              <SidebarItem
                text={key}
                index={index}
                active={isActive(link)}
              />
            </Link>
          </li>
        ))}
      </ul>
      {/* Logout section at the bottom of the sidebar */}
      <div className="pb-5  px-4">
        <hr className="mb-5 text-zinc-700" />
        <a onClick={handleLogout} href="#" className="py-2 flex items-center  text-zinc-500">
          <span className="bg-zinc-800 w-8 h-8 grid place-items-center mr-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {Icons.logout()}
            </svg>
          </span>
          <button className="text-sm font-medium">Logout</button>
        </a>
      </div>
    </div>
  );
}

// Exporting the SidebarLeft component
export default SidebarLeft;



