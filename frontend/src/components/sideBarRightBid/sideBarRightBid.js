// Import required React modules and tools
import React from 'react';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { SocketContext } from '../../context/SocketContext';

// Context for managing the user's wallet and authentication
import UnifiedContext from '../../context/UnifiedContext';

// Socket.io client for real-time functionality
import io from 'socket.io-client';

// Styles specific to the SideBarRightBid component
import styles from './sideBarRightBid.module.css';

// Chai assertion library (seems to be unused in the provided code)
// import { use } from 'chai';

// Countdown component (seems to be unused in the provided code)
import Countdown from 'react-countdown';

// Define the base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

// Define the SideBarRightBid functional component
function SideBarRightBid({ showBetSidebar, itemBid, closeBidSidebar }) {

    // Local state for managing various properties of the bid process
    const [isCheckedAgreement, setIsCheckedAgreement] = React.useState(false);
    const [isCheckedOddsChange, setIsCheckedOddsChange] = React.useState(false);
    const [selectedValue, setSelectedValue] = useState(2);
    const [bid, setBid] = useState(itemBid.bid);
    const [inputValue, setInputValue] = useState("");
    const [lastInputType, setLastInputType] = useState("radio");
    const socket = useContext(SocketContext);

    
    // Contexts for managing user authentication and wallet connection
    const { isConnected, connectWallet, isAuthenticated, userId, loginUser } = useContext(UnifiedContext);


    // User's account details
    const [userAccount, setUserAccount] = useState(null);
    const { selectedItemName } = itemBid;

    // Handler to manage input from radio buttons
    const handleInputChange = (event) => {
      setSelectedValue(parseFloat(event.target.value));
      setLastInputType("radio");
    };

    // Handler to manage input from the text field
    const handleTextInputChange = (event) => {
      const val = event.target.value;

      // Only update if input is a valid number and is greater than current bid
      if (!isNaN(val) && val.trim() !== "" && parseFloat(val) > bid) {
        setInputValue(parseFloat(val));
        setLastInputType("text");
      } else {
        alert("Invalid input. Please enter a valid number.");
      }
    };

    // Fetch user account details based on the authenticated user's ID
    const fetchUserAccount = async () => {
      if (isAuthenticated) {
        const response = await axios.get(`${API_BASE_URL}/api/user/${userId}`);
        setUserAccount(response.data);
      }
    };

    // Handler to manage placing a bid
    const placeBidHandler = async () => {
      try {
        await fetchUserAccount();
        const bidAmount = lastInputType === "text" ? inputValue : selectedValue;

        if (!userAccount || !userAccount.walletAdress) {
          throw new Error('Wallet address not found');
        }

        const placeBidResponse = await axios.post(`${API_BASE_URL}/api/place_bid`, {
          bid_amount: bidAmount,
          marketplace_item_id: itemBid.itemId,
          user_nft_address: userAccount.walletAdress
        });

        if (placeBidResponse.data.success) {
          alert('Bid placed successfully!');
          socket.emit('request_update_bid', { marketplace_item_id: itemBid.itemId, nft_address: itemBid.marketplace_item_nft_address, bid_value: bidAmount });
        } else {
          alert('Failed to place bid.');
        }
      } catch (error) {
        console.error('Error placing bid: ', error);
      }
    };

    // Set up socket.io listeners when the component mounts or updates
    useEffect(() => {
      if (socket) {
        socket.on('update_live_bid', (data) => {
          setBid((currentBid) => {
            if (itemBid.marketplace_item_nft_address === data.nft_address) {
              return data.bid_value;
            }
            return currentBid;
          });
        });
      }
    }, [socket, itemBid]);

    // Fetch the user account details whenever authentication or user ID changes
    useEffect(() => {
      fetchUserAccount();
    }, [isAuthenticated, userId]);

    // Log the bid amount whenever it changes
    useEffect(() => {
      console.log('Updated bid:', bid);
    }, [bid, itemBid]);

return (
    <div className={styles.layout} id="app">

  
<div className={styles.invoice} id={styles.Invoicediv}>
<div className={styles.invoice__wrapper}>
  <h2 className={styles.invoice__title}>
    Invoice for Bid
    <button className={styles.close} onClick={closeBidSidebar}>
<span className={styles['sr-only']}>Close</span>
<svg
  id={styles.Closebtn}
  style={{ width: '24px', height: '24px' }}
  viewBox="0 0 24 24"
>
  <path
    fill="currentColor"
    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
  />
</svg>
</button>
  </h2>
  <article>
    <section className={styles.invoice__section + ' ' + styles.invoice__type}>
      
      <span className={styles.tag + ' ' + styles['tag--primary'] }>Place a Bid</span>
    </section>
    <section className={styles.invoice__section + ' ' + styles.invoice__bet + ' ' + styles.bet}>
      <p className={styles['bet__match']}>
      <div className="bottom-2 w-5/6 bg-zinc-800 rounded-md flex items-center bg-opacity-30 backdrop-blur-md">
      <div className="w-1/2 p-3">
            <h3 className="font-semibold">Ending in</h3>
            <Countdown
              date={Date.now() + itemBid.timeLeft}
              renderer={({ hours, minutes, seconds }) => (
                <div className="">{`${hours}h: ${minutes}m: ${seconds}s`}</div>
              )}
            />
          </div>
      </div>
      </p>
      <div className={styles['bet__outcome']}>
        <p className={styles['bet__outcome__rating']}>
          <span>{selectedItemName}</span>
          <span className={styles['tag'] + ' ' + styles['rating'] + ' ' + styles['rating--primary']}>
            {bid}
          </span>
        </p>
      </div>
    </section>
    <section className={styles.invoice__section + ' ' + styles.invoice__payment + ' ' + styles.payment} >
            <div className={`${styles.invoice__payment__amount} toggle-buttons`}>
<input className={`${styles.toggle} ${styles["toggle--button"]} sr-only`} id="toggle-1" name="amount" type="radio" value="1"  onChange={handleInputChange} />
<label className={`${styles.btn} ${styles["btn--toggle"]}`} htmlFor="toggle-1">{`$${bid + 1}`}</label>
<input checked="checked" className={`${styles.toggle} ${styles["toggle--button"]} sr-only`} id="toggle-2" name="amount" type="radio" value="2"  onChange={handleInputChange} />
<label className={`${styles.btn} ${styles["btn--toggle"]}`} htmlFor="toggle-2">{`$${bid +2}`}</label>
<input className={`${styles.toggle} ${styles["toggle--button"]} sr-only`} id="toggle-5" name="amount" type="radio" value="5" onChange={handleInputChange}  />
<label className={`${styles.btn} ${styles["btn--toggle"]}`} htmlFor="toggle-5">{`$${bid + 5}`}</label>
<label className={styles["sr-only"]}>Any amount</label>
<input placeholder="20$" type="text" onChange={handleTextInputChange}/>
</div>
<div className={styles.invoice__payment__options}>
<h4 className={styles.invoice__payment__options__title}>
  More options
  <button className={`${styles.btn} ${styles["btn--round"]}`}>
    <span className={styles["sr-only"]}>More information</span>
    <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
      <path fill="currentColor" d="M13.5,4A1.5,1.5 0 0,0 12,5.5A1.5,1.5 0 0,0 13.5,7A1.5,1.5 0 0,0 15,5.5A1.5,1.5 0 0,0 13.5,4M13.14,8.77C11.95,8.87 8.7,11.46 8.7,11.46C8.5,11.61 8.56,11.6 8.72,11.88C8.88,12.15 8.86,12.17 9.05,12.04C9.25,11.91 9.58,11.7 10.13,11.36C12.25,10 10.47,13.14 9.56,18.43C9.2,21.05 11.56,19.7 12.17,19.3C12.77,18.91 14.38,17.8 14.54,17.69C14.76,17.54 14.6,17.42 14.43,17.17C14.31,17 14.19,17.12 14.19,17.12C13.54,17.55 12.35,18.45 12.19,17.88C12,17.31 13.22,13.4 13.89,10.71C14,10.07 14.3,8.67 13.14,8.77Z" />
    </svg>
  </button>
</h4>
<input
checked={isCheckedAgreement}
className={styles["sr-only"]}
id="rules-agreement"
type="checkbox"
onChange={() => setIsCheckedAgreement(!isCheckedAgreement)}
/>
<label className={styles.checkbox} htmlFor="rules-agreement">Accept rules of the agreement</label>


</div>
<div className={styles.invoice__payment__recap}>
<div className={styles.invoice__payment__recap__rating}>
  <h4 className={styles.invoice__payment__recap__title}>
    Actual Bid
  </h4>
  <span className={`${styles.tag} ${styles["rating--primary"]}`}>{bid}</span>
</div>
<div className={styles.invoice__payment__recap__winnings}>
  <h4 className={styles.invoice__payment__recap__title}>
    Your Bid
  </h4>
  <p className={styles.invoice__payment__recap__winnings__amount}>
  {bid}$
      </p>
</div>
</div>
</section>
<section className={`${styles.invoice__section} ${styles.invoice__submit}`}>
    <button onClick={placeBidHandler} className={`${styles.btn} ${styles["btn--primary"]}`}>Place a bet</button>
  </section>
</article>
</div>
<div className={styles.invoice__assistance}>
<button className={`${styles.invoice__assistance__button} ${styles.btn} ${styles["btn--secondary"]} ${styles["btn--icon"]}`} type="button">
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12,1C7,1 3,5 3,10V17A3,3 0 0,0 6,20H9V12H5V10A7,7 0 0,1 12,3A7,7 0 0,1 19,10V12H15V20H19V21H12V23H18A3,3 0 0,0 21,20V10C21,5 16.97,1 12,1Z" />
  </svg>
  Technical Support 24/7
</button>
</div>
</div>
</div>

);} 

export default SideBarRightBid;