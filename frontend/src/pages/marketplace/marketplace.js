import React from 'react';
import { useState } from 'react';
import SideBarRight from '../../components/sideBarRight/sideBarRight';
import SideBarRightBid from '../../components/sideBarRightBid/sideBarRightBid';
import Content from '../../components/contents/content/content';
import MarketItems from '../../components/marketItems/marketItems';


const Marketplace = ({ socket }) => {
  const [showBidSidebar, setShowBidSidebar] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const handleBidClick = (ItemBid) => {
    setSelectedBid(ItemBid);
    setShowBidSidebar(true);
  };

  const closeBidSidebar = () => {
    setShowBidSidebar(false);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-48 hidden lg:block shrink-0" />
      <div className="grow">
        <Content />
        <MarketItems onBidClick={handleBidClick} socket={socket} />
      </div>
      {showBidSidebar ? <SideBarRightBid itemBid={selectedBid} closeBidSidebar={closeBidSidebar} socket={socket}/> : <SideBarRight />}
    </div>
  );
};

export default Marketplace;