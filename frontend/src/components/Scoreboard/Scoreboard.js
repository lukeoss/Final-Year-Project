// components/Scoreboard.js
import React from 'react';

const Scoreboard = ({ score }) => {
  return (
    <div className="scoreboard">
      <div className="team-score">
        <h2>HOME</h2>
        <p>{score.home}</p>
      </div>
      <div className="team-score">
        <h2>AWAY</h2>
        <p>{score.away}</p>
      </div>
    </div>
  );
};

export default Scoreboard;
