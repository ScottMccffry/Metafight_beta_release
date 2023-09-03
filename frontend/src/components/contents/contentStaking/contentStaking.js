import React from 'react';
function ContentStaking() {
  return (
    <div className="w-4/5">
      <h1 className="text-2xl font-bold px-3 mt-3">Staking</h1>
      <h2 className="text-zinc-500 px-3">
Staking your NFT ables to gain experience for your fighter and money for you as your fighter is constantly fighting      </h2>
      <div className="p-3">
        <div
          className="w-full h-44  rounded-md bg-center bg-cover flex flex-col justify-center px-4"
          style={{
            backgroundImage:
              'url(https://assets.codepen.io/3685267/nft-dashboard-art-6.jpg)',
          }}
        >
          <h2 className="font-bold text-3xl max-w-4/5">
            Choose a Staking pool
          </h2>
          <button className="py-2 bg-gradient-to-tr from-fuchsia-600 to-violet-600 rounded-md w-44 mt-3">
            get 100 extra fights on your first purchase
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between px-3 mt-3">
        <h2 className="text-xl font-semibold">Your Stackable NFTs</h2>
        <h2 className="text-xl font-semibold">Staking Options</h2>
      </div>
    </div>
  );
}

export default ContentStaking;

