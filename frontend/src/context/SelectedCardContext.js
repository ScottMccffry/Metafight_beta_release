import React, { createContext, useState } from 'react';

export const SelectedCardContext = createContext();

export const SelectedCardProvider = ({ children }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <SelectedCardContext.Provider value={{ selectedCard, setSelectedCard }}>
      {children}
    </SelectedCardContext.Provider>
  );
};