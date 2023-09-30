
import React, { useState, useEffect } from 'react';
import { SelectedCardProvider } from '../../context/SelectedCardContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NonFungibleToken from '../../components/nonFungibleToken/nonFungibleToken';
import FighterSpecs from '../../components/fighterSpecs/fighterSpecs';
import SaleData from '../../components/saleData/saleData';
import CardStackTraining from '../../components/cardStackTraining/cardStackTraining';
import TrainingOptions from '../../components/trainingOptions/trainingOptions';
import ContentTraining from '../../components/contents/contentTraining/contentTraining';

const API_BASE_URL = 'http://127.0.0.1:5000';

const Training = () => {

  return (
    <SelectedCardProvider>

    <div className="flex flex-col md:flex-row h-screen">
      
      <div className="w-48 hidden lg:block shrink-0" />
      <div className="flex flex-col w-full">
      <ContentTraining/>
        <div className="flex flex-row flex-grow w-4/5 justify-center items-center h-4/5">
            <div className="rounded-lg pb-5  h-full w-2/5 mr-1 flex items-center justify-center">
            <CardStackTraining/>
            </div>
            <div className="rounded-lg w-3/5 pb-5 h-full ml-1 flex items-center justify-center pr-0">
              <TrainingOptions/>
            </div>
        </div>
        </div>
    </div>
     </SelectedCardProvider>

  );
};
 

export default Training;
