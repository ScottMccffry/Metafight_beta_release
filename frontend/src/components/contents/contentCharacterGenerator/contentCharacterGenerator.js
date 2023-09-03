import React from 'react';
import ArtworkSelector from '../artworkSelector/ArtworkSelector';
function ContentCharacterGenerator() {
  return (
    <div className="w-4/5">
      <h1 className="text-2xl font-bold px-3 mt-3">Character Generator</h1>
      <h2 className="text-zinc-500 px-3">
        Choose different characteristics and make your own fighter
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
        <h2 className="text-xl font-semibold"></h2>
      </div>
    </div>
  );
}

export default ContentCharacterGenerator;

