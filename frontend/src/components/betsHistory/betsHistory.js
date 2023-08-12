import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL


const BetsHistory = ({ betsHistoryIn, fightData}) => {
  const [betsHistory, setBetsHistory] = useState(betsHistoryIn || []);
  let { fightId, fighter1, fighter2, odd1, odd2 } = fightData;

  useEffect(() => {
    // This will run every time `betsHistoryIn` changes
    if (betsHistoryIn) {
      setBetsHistory(betsHistoryIn);
    }
  }, [betsHistoryIn]);

  useEffect(() => {
    // This will run if `betsHistoryIn` is not provided and we have a `fightId`
    if (!betsHistoryIn && fightId) {
      const fetchBetsHistory = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/betshistory/${fightId}`);
          setBetsHistory(response.data);
        } catch (error) {
          console.error('Error fetching bets history:', error);
        }
      };
      fetchBetsHistory();
    }
  }, [betsHistoryIn, fightId]);
  return (


      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs  uppercase bg-gray-700 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Fight ID</th>
              <th scope="col" className="px-6 py-3">Fighter NFT Address</th>
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Odd</th>
              <th scope="col" className="px-6 py-3">Wallet Address</th>
            </tr>
          </thead>
          <tbody>
            {betsHistory.map((bet) => (
              <tr className="bg-zinc-800 border-zinc-700" key={bet.id}>
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">{bet.fight_id}</th>
                <td className="px-6 py-4">{bet.fighter_nft_address}</td>
                <td className="px-6 py-4">{bet.amount}</td>
                <td className="px-6 py-4">{bet.odd}</td>
                <td className="px-6 py-4">{bet.wallet_adress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default BetsHistory;