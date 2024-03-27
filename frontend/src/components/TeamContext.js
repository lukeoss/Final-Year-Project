import React, { createContext, useContext, useState } from 'react';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [team, setTeam] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);

  return (
    <TeamContext.Provider value={{ team, setTeam, selectedTeamId, setSelectedTeamId, selectedDirection, setSelectedDirection }}>  
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);

