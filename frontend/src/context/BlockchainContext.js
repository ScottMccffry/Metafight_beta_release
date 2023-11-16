
import React, { createContext, useContext} from 'react';

const BlockchainContext = createContext({ 
//functions
mintNFT: () => {},
stakeNFT: () => {},

});

export default BlockchainContext;