import React, { createContext, useContext, useState } from 'react';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [team, setTeam] = useState(null);

  return (
    <TeamContext.Provider value={{ team, setTeam }}>  
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
