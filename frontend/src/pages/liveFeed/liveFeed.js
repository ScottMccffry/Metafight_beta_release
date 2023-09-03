// LiveFeed.js

import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import SideBarRight from '../../components/sideBarRight/sideBarRight';
import SideBarRightBet from '../../components/sideBarRightBet/sideBarRightBet';
import ContentFight from '../../components/contents/contentFight/contentFight';
import Items from '../../components/items/items';

const LiveFeed = () => {
  const [showBetSidebar, setShowBetSidebar] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);

  const handleBetClick = (fightBet) => {
    setSelectedBet(fightBet);
    setShowBetSidebar(true);
  };

  const closeBetSidebar = () => {
    setShowBetSidebar(false);
  };

  
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-48 hidden lg:block shrink-0" />
      <div className="grow ">
        <ContentFight />
        <Items onBetClick={handleBetClick}  />
      </div>
      {showBetSidebar ? <SideBarRightBet fightBet={selectedBet} closeBetSidebar={closeBetSidebar} /> : <SideBarRight />}
    </div>
  );
};

export default LiveFeed;