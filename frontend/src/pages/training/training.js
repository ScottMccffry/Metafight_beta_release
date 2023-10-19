
import React, { useContext } from 'react';
import UnifiedContext from '../../context/UnifiedContext';
import { SelectedCardProvider } from '../../context/SelectedCardContext';
import CardStackTraining from '../../components/cardStackTraining/cardStackTraining';
import TrainingOptions from '../../components/trainingOptions/trainingOptions';
import ContentTraining from '../../components/contents/contentTraining/contentTraining';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const Training = () => {
  const { 
    isConnected, 
    connectWallet, 
    isAuthenticated, 
    userId, 
    loginUser 
  } = useContext(UnifiedContext);
  

  return (
    <SelectedCardProvider>

    <div className="flex flex-col md:flex-row h-screen">
      
      <div className="w-48 hidden lg:block shrink-0" />
      <div className="flex flex-col w-full">
      <ContentTraining/>
        <div className="flex flex-row flex-grow w-4/5 justify-center items-center h-4/5">
        {isConnected || isAuthenticated ? (
          <>
            <div className="rounded-lg pb-5  h-full w-2/5 ml-1 flex items-center justify-center">
            <CardStackTraining/>
            </div>
            <div className="rounded-lg w-3/5 pb-5 h-full mr-1 flex items-center justify-center pr-0">
              <TrainingOptions/>
            </div>
            </>
        ):(
          <p>Requires to be connected</p>
        )}
        </div>
        </div>
    </div>
     </SelectedCardProvider>

  );
};
 

export default Training;
