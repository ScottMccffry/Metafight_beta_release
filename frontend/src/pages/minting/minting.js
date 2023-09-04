import React from 'react';
import CharacterGenerator from '../../components/characterGenerator/characterGenerator';
import ContentCharacterGenerator from '../../components/contents/contentCharacterGenerator/contentCharacterGenerator';

const MintingPage = () => {
  return (<div className="flex flex-col md:flex-row">
  <div className="w-48 hidden lg:block shrink-0" />
  <div className=" grow ">
          <ContentCharacterGenerator />
          <CharacterGenerator />
        </div>
    </div>
  );
};

export default MintingPage;
