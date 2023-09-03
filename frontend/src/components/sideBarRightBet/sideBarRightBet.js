import React from 'react';
import { useState, useContext, useEffect} from 'react';
import axios from 'axios';
import WalletContext from '../../../../frontend/src/context/WalletContext';
import AuthContext from '../../../../frontend/src/context/AuthContext';
import {SocketContext} from '../../../../frontend/src/context/SocketContext';

import styles from './sideBarRightBet.module.css';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL


function SideBarRightBet({ fightBet, closeBetSidebar }) {
  const [isCheckedAgreement, setIsCheckedAgreement] = React.useState(false);
  const [isCheckedOddsChange, setIsCheckedOddsChange] = React.useState(false);
  const [selectedValue, setSelectedValue] = useState(2); // 2 is default checked value
  const [odd, setOdd] = useState(fightBet.odd); // This should be your real odd. It's 1 by default here
  const [inputValue, setInputValue] = useState("");
  const [lastInputType, setLastInputType] = useState("radio");
  const { isAuthenticated, userId,loginUser } = useContext(AuthContext);
  const { isConnected, connectWallet } = useContext(WalletContext);
  const {socket } = useContext(SocketContext);
  const [userAccount, setUserAccount] = useState(null);

  // Update your handlers:
  const handleInputChange = (event) => {
    setSelectedValue(parseFloat(event.target.value));
    setLastInputType("radio");
  };

  const handleTextInputChange = (event) => {
    const val = event.target.value;
    
    // Only update if it's a valid number
    //to make sure they don't enter a string
    if (!isNaN(val) && val.trim() !== "") {
      if(parseFloat(val) > 0){
        setInputValue(parseFloat(val));
        setLastInputType("text");
        }else {
          alert("The value you entered is inferior to 0.")
        }
    } else {
      alert("Invalid input. Please enter a valid number.");
    }
  };
  const fetchUserAccount = async () => {
    try {
      if (isAuthenticated) {
        console.log("User ID:", userId);
        const response = await axios.get(`${API_BASE_URL}/api/user/${userId}`);
        console.log("User account:", response.data);
        setUserAccount(response.data);
      }
      // Code for isConnected case can be added here
    } catch (error) {
      console.error('Error fetching user account: ', error);
      alert('Error fetching user account. Please try again later.');
    }
  };
  
  const placeBetHandler = async () => {
    try {
      // Fetch the user account data if it's not already fetched

      await fetchUserAccount();
      
  
      const betAmount = lastInputType === "text" ? inputValue : selectedValue;
  
      if (!userAccount || !userAccount.walletAdress) {
        throw new Error('Wallet address not found');
      }
  
      const placeBetResponse = await axios.post(`${API_BASE_URL}/api/place_bet`, {
        betAmount: betAmount,
        fightId: fightBet.fightId,
        selectedFighter: fightBet.selectedFighter.nft_address,
        odd: fightBet.odd,
        walletAddress: userAccount.walletAdress
      });
  
      if (placeBetResponse.data.success) {
        alert('Bet placed and transaction recorded successfully!');
        console.log('fightBet.fightId: ', fightBet.fightId);
        socket.emit('request_update_odd', { fight_id: fightBet.fightId, selected_fighter: fightBet.selectedFighter.nft_address, fighter1: fightBet.fighter1.nft_address, fighter2: fightBet.fighter2.nft_address });
      } else {
        alert('Failed to place bet.');
      }
    } catch (error) {
      console.error('Error placing bet: ', error);
    }
  };
  useEffect(() => {
    console.log('Items useEffect SBB hook ran with socket:', socket);
    setOdd(fightBet.odd);
    if (socket) {
      console.log('Setting up update event listener');
      
      socket.on('update_odd', (data) => {
        console.log('Update event received with data:', data);
        console.log('fightBet : ', fightBet)
        console.log('data :',data)
        
        setOdd((currentOdd) => {
          
          if (fightBet.fightId === data.fight_id) {
            return fightBet.selectedFighter.nft_address === data.fighter1
              ? data.odds.odd1
              : data.odds.odd2;
          }

          return currentOdd;
        });
      });
    };
  }, [socket, fightBet]);

  useEffect(() => {
    fetchUserAccount();
  }, [isAuthenticated, userId]);  

  useEffect(() => {
    console.log('Updated odd:', odd);
  }, [odd, fightBet]);
  // not sure about keeping fight or putting selectedbets

    const { selectedFighter, fighter1, fighter2} = fightBet;
    return (
      <div className={styles.layout} id="app">
 
    
 <div className={styles.invoice} id={styles.Invoicediv}>
  <div className={styles.invoice__wrapper}>
    <h2 className={styles.invoice__title}>
      Invoice for payment
      <button className={styles.close} onClick={closeBetSidebar}>
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
        <label className={styles['switch__label']}>
     
          <span className={styles['switch__option']}>Your Bet</span>
        </label>
      </section>
      <section className={styles.invoice__section + ' ' + styles.invoice__bet + ' ' + styles.bet}>
        <p className={styles['bet__match']}>
          <span className={styles['bet__team']}>{fighter1.name}</span>
          <span className={styles['bet__team__separator']}>vs</span>
          <span className={styles['bet__team'] + ' ' + styles['bet__team--loser']}>{fighter2.name}</span>
          <button className={styles.btn + ' ' + styles['btn--round']}>
            <span className={styles['sr-only']}>Delete</span>
            <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
              />
            </svg>
          </button>
        </p>
        <div className={styles['bet__outcome']}>
          <small className={styles['bet__outcome__state']}>Winner</small>
          <p className={styles['bet__outcome__rating']}>
            <span>{selectedFighter.name}</span>
            <span className={styles['tag'] + ' ' + styles['rating'] + ' ' + styles['rating--primary']}>
              {odd}
            </span>
          </p>
        </div>
      </section>
      <section className={styles.invoice__section + ' ' + styles.invoice__payment + ' ' + styles.payment} >
              <div className={`${styles.invoice__payment__amount} toggle-buttons`}>
  <input className={`${styles.toggle} ${styles["toggle--button"]} sr-only`} id="toggle-1" name="amount" type="radio" value="1"  onChange={handleInputChange} />
  <label className={`${styles.btn} ${styles["btn--toggle"]}`} htmlFor="toggle-1">1$</label>
  <input checked="checked" className={`${styles.toggle} ${styles["toggle--button"]} sr-only`} id="toggle-2" name="amount" type="radio" value="2"  onChange={handleInputChange} />
  <label className={`${styles.btn} ${styles["btn--toggle"]}`} htmlFor="toggle-2">2$</label>
  <input className={`${styles.toggle} ${styles["toggle--button"]} sr-only`} id="toggle-5" name="amount" type="radio" value="5" onChange={handleInputChange}  />
  <label className={`${styles.btn} ${styles["btn--toggle"]}`} htmlFor="toggle-5">5$</label>
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
<input
  checked={isCheckedOddsChange}
  className={styles["sr-only"]}
  id="odds-agreement"
  type="checkbox"
  onChange={() => setIsCheckedOddsChange(!isCheckedOddsChange)}
/>
<label className={styles.checkbox} htmlFor="odds-agreement">Accept any odds changes</label>

</div>
<div className={styles.invoice__payment__recap}>
  <div className={styles.invoice__payment__recap__rating}>
    <h4 className={styles.invoice__payment__recap__title}>
      Total Rate
    </h4>
    <span className={`${styles.tag} ${styles["rating--primary"]}`}>{odd}</span>
  </div>
  <div className={styles.invoice__payment__recap__winnings}>
    <h4 className={styles.invoice__payment__recap__title}>
      Possible winnings
    </h4>
    <p className={styles.invoice__payment__recap__winnings__amount}>
    {((lastInputType === "text" ? inputValue : selectedValue) * odd).toFixed(2)}$
        </p>
  </div>
</div>
</section>
<section className={`${styles.invoice__section} ${styles.invoice__submit}`}>
      <button onClick={placeBetHandler} className={`${styles.btn} ${styles["btn--primary"]}`}>Place a bet</button>
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

export default SideBarRightBet;