// components/HomeAwaySection.js
import React from 'react';
import { Button } from 'react-bootstrap';

const actions = ["Goal", "Point", "Miss", "Block", "Foul"];

const HomeAwaySection = ({ side, onActionClick }) => {
  return (
    <div className={`${side}-actions`}>
      {actions.map((action) => (
        <Button
          key={`${side}-${action}`}
          onClick={() => onActionClick(side, action)}
        >
          {action}
        </Button>
      ))}
    </div>
  );
};

export default HomeAwaySection;
