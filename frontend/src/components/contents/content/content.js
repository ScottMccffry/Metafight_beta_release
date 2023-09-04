import React from 'react';
import ArtworkSelector from '../../artworkSelector/artworkSelector';
function Content() {
  return (
    <div className="">
      <h1 className="text-2xl font-bold px-3 mt-3">Marketplace</h1>
      <h2 className="text-zinc-500 px-3">
       See all the fighters that are available for trading
      </h2>
      <div className="p-3">
        <div
          className="w-full h-44  rounded-md bg-center bg-cover flex flex-col justify-center px-4"
          style={{
            backgroundImage:
              'url(https://assets.codepen.io/3685267/nft-dashboard-art-6.jpg)',
          }}
        >
          <h2 className="font-bold text-3xl max-w-sm">
            Discount
          </h2>
          <button className="py-2 bg-gradient-to-tr from-fuchsia-600 to-violet-600 rounded-md w-44 mt-3">
            get 2.5% off on your first purchase
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between px-3 mt-3">
        <h2 className="text-xl font-semibold">Trending Artworks</h2>
        <ul className="inline-flex space-x-3 ">
          {['General', 'MetaFight'].map((text, index) => (
            <ArtworkSelector key={text} text={text} index={index} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Content;

