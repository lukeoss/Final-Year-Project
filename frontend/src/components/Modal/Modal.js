import React from 'react';
import './modal.css';

// Assume players is an array of objects like [{ name: "Player 1", number: 1 }, ...] or null
const ModalComponent = ({ onActionSelected, players }) => {
  const layout = players
    ? null // When players data is available, we don't use the layout array
    : [[1], [2, 3, 4], [5, 6, 7], [8, 9], [10, 11, 12], [13, 14, 15]];

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div onClick={stopPropagation} className="modal-style">
      <h2>Select a Player</h2>
      {players ? (
        // Render buttons for each player when players data is provided
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {players.map((player, index) => (
            <button key={index} onClick={() => onActionSelected(player.number)} style={{ margin: '5px' }}>
              {player.name} ({player.number})
            </button>
          ))}
        </div>
      ) : (
        // Fallback to rendering number selection buttons if no players data is provided
        layout.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
            {row.map((number) => (
              <button key={number} onClick={() => onActionSelected(number)} style={{ margin: '5px' }}>
                {number}
              </button>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ModalComponent;
