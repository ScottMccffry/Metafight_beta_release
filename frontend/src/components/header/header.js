// Importing necessary hooks, utilities, and styles from React, other libraries, and local modules
import React, { useContext, useState, useEffect, useCallback } from 'react';
import WalletContext from '../../../../frontend/src/context/WalletContext';
import AuthContext from '../../../../frontend/src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './header.css';
import axios from 'axios';

// Local constant for the API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
// `Header` component definition
function Header() {
  // Context hooks to get wallet and authentication states and functions
  const { isConnected, connectWallet } = useContext(WalletContext);
  const { isAuthenticated, userId, loginUser } = useContext(AuthContext);
  
  // State hooks for user data, various popups, login details, errors, and dropdowns
  const [userData, setUserData] = useState(null);
  const [showConnectPopup, setShowConnectPopup] = useState(false);
  const [showUsernameLoginPopup, setShowUsernameLoginPopup] = useState(false);
  const [usernameRegister, setUsernameRegister] = useState(false);
  const [usernameLogin, setUsernameLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [openDropdownMenu, setOpenDropdownMenu] = useState(false);

  // Hook for navigation
  const navigate = useNavigate();

  // Callback hook to fetch user data
  const fetchUserData = useCallback(async (userIdFromLogin) => {
    const idToUse = userIdFromLogin || userId;
    if (idToUse) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/${idToUse}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      setUserData(null);
    }
  }, [userId]);

  // Effect hook to fetch user data whenever the `userId` changes
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Handler functions for various input changes and button clicks
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const connectClick = () => {
    setShowConnectPopup(true);
    // There's a note to maybe only connect to the wallet once the user clicks on Metamask
    // connectWallet();
  }

  const connectMetamaskClick = () => {
    connectWallet();
  }

  const usernameLoginClick = () => {
    setUsernameLogin(true);
  }

  const registerLoginClick = () => {
    setUsernameRegister(true);
  }

  const closeConnectPopup = () => {
    setShowConnectPopup(false);
  }

  const closeUsernameLoginPopup = () => {
    setShowUsernameLoginPopup(false);
    setShowConnectPopup(false);
    setUsernameLogin(false);
  }

  const closeUsernameRegisterPopup = () => {
    setShowUsernameLoginPopup(false);
    setShowConnectPopup(false);
    setUsernameLogin(false);
    setUsernameRegister(false);
  }

  // Toggles the dropdown menu
  const DropdownMenu = () => {
    setOpenDropdownMenu(!openDropdownMenu);
  }

  // Handler function to submit the login form
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userIdFromLogin = await loginUser(email, password);
      if (userIdFromLogin) {
        await fetchUserData(userIdFromLogin); // Use the `userId` from the login to fetch user data
        setShowConnectPopup(false);
      }
    } catch (error) {
      setLoginError(error.message);
    }
  };

  // Component render would be here
  return (



      <div className={'flex flex-wrap p-3 items-center sticky top-0 h-fit  md:h-16 z-30 ${styles.background}'} >
        <div className="flex items-center grow md:grow-0 w-fit md:w-48">
    <div className="w-10 h-10 grid place-items-center rounded-full">
      
    </div>
    <div className="ml-2 font-bold text-xl">METAFIGHT</div>
  </div>



  {isConnected || isAuthenticated ? (
  <>
        <div className="relative flex items-center order-2 md:order-3 pl-0 md:pl-3">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        <div className="absolute right-0 top-0 w-3 h-3 bg-zinc-900 rounded-full p-0.5">
          <div className="bg-red-500 w-full h-full  rounded-full" />
        </div>
      </div>
      {userData && 
        <img
          src={userData.image}
          alt="user"
          className="w-10 h-10 rounded-full ml-4"
        />
      }
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 ml-4"
        viewBox="0 0 20 20"
        fill="currentColor"
        onClick={DropdownMenu}
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>

    {openDropdownMenu && (
      <div className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute right-2 top-16">
        <div className="px-4 py-3">
          <span className="block text-sm text-gray-900 dark:text-white">{userData.username}</span>
          <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{userData.email}</span>
        </div>
        <ul>
          <li>
            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
             onClick={() => navigate(`/profile/${userData.walletAdress}`, { state: {userData} })
            }>Profile</div>
          </li>
          <li>
            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</div>
          </li>
          <li>
            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</div>
          </li>
          <li>
            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</div>
          </li>
        </ul>
      </div>
    )}
  </>
) : (
  <div className="flex items-center order-2 md:order-3 w-1/6">
    <button onClick={connectClick} className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-full h-12 rounded-md font-semibold">
      Connect
    </button>
  </div>
)}   {/* 
  {isConnected ||  isAuthenticated && openDropdownMenu && (
        <div className="z-50 my-4 text-base list-none  divide-y  rounded-lg shadow bg-gray-700 divide-gray-600">
          <div className="px-4 py-3">
            <span className="block text-sm text-gray-900 text-white">{userData.username}</span>
            <span className="block text-sm text-gray-500 truncate text-gray-400">{userData.email}</span>
          </div>
          <ul>
            <li>
              <a href="#" className="block px-4 py-2 text-sm   hover:bg-gray-600 text-gray-200 hover:text-white">Dashboard</a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 text-sm   hover:bg-gray-600 text-gray-200 hover:text-white">Settings</a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 text-sm   hover:bg-gray-600 text-gray-200 hover:text-white">Earnings</a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 text-sm   hover:bg-gray-600 text-gray-200 hover:text-white">Sign out</a>
            </li>
          </ul>
        </div>
      )}*/}
      {showConnectPopup && !usernameLogin && ( 
        <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
        <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <button onClick={closeConnectPopup} className="absolute top-0 right-0 m-2 bg-gray-100 rounded-full p-1 hover:bg-gray-200 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
          <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
            Connect wallet
        </h5>
        <p className="text-sm font-normal text-gray-500 text-gray-400">Connect with one of our available wallet providers or create a new one.</p>
        <ul className="my-4 space-y-3">
            <li>
                <a href="#" onClick={connectMetamaskClick} className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <svg aria-hidden="true" className="h-4" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39.0728 0L21.9092 12.6999L25.1009 5.21543L39.0728 0Z" fill="#E17726"/><path d="M0.966797 0.0151367L14.9013 5.21656L17.932 12.7992L0.966797 0.0151367Z" fill="#E27625"/><path d="M32.1656 27.0093L39.7516 27.1537L37.1004 36.1603L27.8438 33.6116L32.1656 27.0093Z" fill="#E27625"/><path d="M7.83409 27.0093L12.1399 33.6116L2.89876 36.1604L0.263672 27.1537L7.83409 27.0093Z" fill="#E27625"/><path d="M17.5203 10.8677L17.8304 20.8807L8.55371 20.4587L11.1924 16.4778L11.2258 16.4394L17.5203 10.8677Z" fill="#E27625"/><path d="M22.3831 10.7559L28.7737 16.4397L28.8067 16.4778L31.4455 20.4586L22.1709 20.8806L22.3831 10.7559Z" fill="#E27625"/><path d="M12.4115 27.0381L17.4768 30.9848L11.5928 33.8257L12.4115 27.0381Z" fill="#E27625"/><path d="M27.5893 27.0376L28.391 33.8258L22.5234 30.9847L27.5893 27.0376Z" fill="#E27625"/><path d="M22.6523 30.6128L28.6066 33.4959L23.0679 36.1282L23.1255 34.3884L22.6523 30.6128Z" fill="#D5BFB2"/><path d="M17.3458 30.6143L16.8913 34.3601L16.9286 36.1263L11.377 33.4961L17.3458 30.6143Z" fill="#D5BFB2"/><path d="M15.6263 22.1875L17.1822 25.4575L11.8848 23.9057L15.6263 22.1875Z" fill="#233447"/><path d="M24.3739 22.1875L28.133 23.9053L22.8184 25.4567L24.3739 22.1875Z" fill="#233447"/><path d="M12.8169 27.0049L11.9606 34.0423L7.37109 27.1587L12.8169 27.0049Z" fill="#CC6228"/><path d="M27.1836 27.0049L32.6296 27.1587L28.0228 34.0425L27.1836 27.0049Z" fill="#CC6228"/><path d="M31.5799 20.0605L27.6165 24.0998L24.5608 22.7034L23.0978 25.779L22.1387 20.4901L31.5799 20.0605Z" fill="#CC6228"/><path d="M8.41797 20.0605L17.8608 20.4902L16.9017 25.779L15.4384 22.7038L12.3988 24.0999L8.41797 20.0605Z" fill="#CC6228"/><path d="M8.15039 19.2314L12.6345 23.7816L12.7899 28.2736L8.15039 19.2314Z" fill="#E27525"/><path d="M31.8538 19.2236L27.2061 28.2819L27.381 23.7819L31.8538 19.2236Z" fill="#E27525"/><path d="M17.6412 19.5088L17.8217 20.6447L18.2676 23.4745L17.9809 32.166L16.6254 25.1841L16.625 25.1119L17.6412 19.5088Z" fill="#E27525"/><path d="M22.3562 19.4932L23.3751 25.1119L23.3747 25.1841L22.0158 32.1835L21.962 30.4328L21.75 23.4231L22.3562 19.4932Z" fill="#E27525"/><path d="M27.7797 23.6011L27.628 27.5039L22.8977 31.1894L21.9414 30.5138L23.0133 24.9926L27.7797 23.6011Z" fill="#F5841F"/><path d="M12.2373 23.6011L16.9873 24.9926L18.0591 30.5137L17.1029 31.1893L12.3723 27.5035L12.2373 23.6011Z" fill="#F5841F"/><path d="M10.4717 32.6338L16.5236 35.5013L16.4979 34.2768L17.0043 33.8323H22.994L23.5187 34.2753L23.48 35.4989L29.4935 32.641L26.5673 35.0591L23.0289 37.4894H16.9558L13.4197 35.0492L10.4717 32.6338Z" fill="#C0AC9D"/><path d="M22.2191 30.231L23.0748 30.8354L23.5763 34.8361L22.8506 34.2234H17.1513L16.4395 34.8485L16.9244 30.8357L17.7804 30.231H22.2191Z" fill="#161616"/><path d="M37.9395 0.351562L39.9998 6.53242L38.7131 12.7819L39.6293 13.4887L38.3895 14.4346L39.3213 15.1542L38.0875 16.2779L38.8449 16.8264L36.8347 19.1742L28.5894 16.7735L28.5179 16.7352L22.5762 11.723L37.9395 0.351562Z" fill="#763E1A"/><path d="M2.06031 0.351562L17.4237 11.723L11.4819 16.7352L11.4105 16.7735L3.16512 19.1742L1.15488 16.8264L1.91176 16.2783L0.678517 15.1542L1.60852 14.4354L0.350209 13.4868L1.30098 12.7795L0 6.53265L2.06031 0.351562Z" fill="#763E1A"/><path d="M28.1861 16.2485L36.9226 18.7921L39.7609 27.5398L32.2728 27.5398L27.1133 27.6049L30.8655 20.2912L28.1861 16.2485Z" fill="#F5841F"/><path d="M11.8139 16.2485L9.13399 20.2912L12.8867 27.6049L7.72971 27.5398H0.254883L3.07728 18.7922L11.8139 16.2485Z" fill="#F5841F"/><path d="M25.5283 5.17383L23.0847 11.7736L22.5661 20.6894L22.3677 23.4839L22.352 30.6225H17.6471L17.6318 23.4973L17.4327 20.6869L16.9139 11.7736L14.4707 5.17383H25.5283Z" fill="#F5841F"/></svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">MetaMask</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 text-gray-400">Popular</span>
                </a>
            </li>
            <li>
                <a href="#"  onClick={usernameLoginClick} className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <svg aria-hidden="true" className="h-5" viewBox="0 0 292 292" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M145.7 291.66C226.146 291.66 291.36 226.446 291.36 146C291.36 65.5541 226.146 0.339844 145.7 0.339844C65.2542 0.339844 0.0400391 65.5541 0.0400391 146C0.0400391 226.446 65.2542 291.66 145.7 291.66Z" fill="#3259A5"/><path d="M195.94 155.5C191.49 179.08 170.8 196.91 145.93 196.91C117.81 196.91 95.0204 174.12 95.0204 146C95.0204 117.88 117.81 95.0897 145.93 95.0897C170.8 95.0897 191.49 112.93 195.94 136.5H247.31C242.52 84.7197 198.96 44.1797 145.93 44.1797C89.6904 44.1797 44.1104 89.7697 44.1104 146C44.1104 202.24 89.7004 247.82 145.93 247.82C198.96 247.82 242.52 207.28 247.31 155.5H195.94Z" fill="white"/></svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">Username Login</span>
                </a>
            </li>
            </ul>
        <div>
            <a href="#" className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline text-gray-400">
                <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                Why do I need to connect with my wallet?</a>
        </div>
          </div>
        </div>
        </div>
      )}
      {showConnectPopup && usernameLogin && (
        <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
        <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <button onClick={closeUsernameLoginPopup} className="absolute top-0 right-0 m-2 bg-gray-100 rounded-full p-1 hover:bg-gray-200 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
            <form onSubmit={handleSubmit} className="space-y-6" action="#">
                <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
                <div>
                    <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <input onChange={handleEmailChange} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required></input>
                </div>
                <div>
                    <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <input onChange={handlePasswordChange} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required></input>
                </div>
                <div className="flex items-start">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required></input>
                        </div>
                        <label for="remember" className="ml-2 text-sm font-medium text-gray-900 text-gray-300">Remember me</label>
                    </div>
                    <a href="#" className="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
                </div>
                <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                <button onClick={registerLoginClick}className="text-sm font-medium text-gray-500 text-gray-300">
                    Not registered? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
                </button>
            </form>
        </div>
        </div>
      )}
      {showConnectPopup && usernameRegister && ( 
                <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <button onClick={closeUsernameRegisterPopup} className="absolute top-0 right-0 m-2 bg-gray-100 rounded-full p-1 hover:bg-gray-200 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
                  <form>
                    <div className="mb-6">
                      <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="name@flowbite.com" required></input>
                    </div>
                    <div className="mb-6">
                      <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                      <input type="password" id="password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required></input>
                    </div>
                    <div className="mb-6">
                      <label for="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat password</label>
                      <input type="password" id="repeat-password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required></input>
                    </div>
                    <div className="flex items-start mb-6">
                      <div className="flex items-center h-5">
                        <input id="terms" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required></input>
                      </div>
                      <label for="terms" className="ml-2 text-sm font-medium text-gray-900 text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register new account</button>
                  </form>

                </div>
                </div>

      )}
  
        <div className="flex  mt-4 md:mt-0 order-3 md:order-2 w-full grow md:w-fit ">
          <button className="w-10 h-10 rounded-md bg-zinc-700 grid place-items-center mr-2 block md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <form className=" ml-10 relative grow md:max-w-lg">
            <input
              type="text"
              className="bg-zinc-700  pl-3 pr-10 h-10 rounded-md w-full "
              placeholder="search for collection"
            />
            <span className="absolute right-0 top-0 bottom-0 w-10 grid place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </form>
        </div>
      </div>
    );
  }
  export default Header;