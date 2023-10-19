import React, { useContext } from 'react';
import UnifiedContext from '../../context/UnifiedContext';
import CardStack from '../../components/cardStack/cardStack';
import StackingOptions from '../../components/stakingOptions/stakingOptions';
import ContentStaking from '../../components/contents/contentStaking/contentStaking';

const API_BASE_URL = 'http://127.0.0.1:5000';

const Stacking = () => {
    const { 
        isConnected, 
        connectWallet, 
        isAuthenticated, 
        userId, 
        loginUser 
      } = useContext(UnifiedContext);
      

  return (
    <div className="flex flex-col md:flex-row h-screen">
      
      <div className="w-48 hidden lg:block shrink-0" />
      <div className="flex flex-col w-full">
      <ContentStaking/>
        <div className="flex flex-row flex-grow w-4/5 justify-center items-center h-4/5">
        {isConnected || isAuthenticated ? (
            <>
            <div className="rounded-lg pb-5  h-full w-2/5 mr-1 flex items-center justify-center">
            <CardStack/>
            </div>
            <div className="rounded-lg w-3/5 pb-5 h-full ml-1 flex items-center justify-center pr-0">
              <StackingOptions/>
            </div>
              </>
              ):(
                <p>Requires to be connected</p>
              )}
        </div>
        </div>
    </div>

  );
};
 

export default Stacking;
