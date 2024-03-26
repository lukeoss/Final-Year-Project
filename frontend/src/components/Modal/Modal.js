import React from 'react';
import { useTeam } from '../TeamContext';
import './modal.css';

const ModalComponent = ({ onActionSelected }) => {
  const { team } = useTeam();

  const layout = [
    [1], [2, 3, 4], [5, 6, 7], [8, 9], [10, 11, 12], [13, 14, 15]
  ];

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const generateRows = () => {
    if (!team || !team.players || team.players.length === 0) {
      return <div>No players found for the selected team.</div>;
    }

    return layout.map((row, rowIndex) => (
      <div key={rowIndex} className="player-row d-flex justify-content-center" style={{ margin: '10px' }}>
        {row.map(number => {
          const player = team.players.find(p => p.player_number === number);

          return (
            <div key={number} className="col-auto mb-2" style={{ padding: '0 5px' }} onClick={() => player && onActionSelected(player.player_number)}>
              <div className="card clickable" style={{ width: '100px', cursor: 'pointer' }}>
                <div className="card-body d-flex justify-content-center align-items-center" style={{ padding: '10px' }}>
                  <div className="text-center" style={{ fontSize: '0.8rem' }}>
                    {player ? `${player.player_last_name} (${player.player_number})` : `N/A (${number})`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div onClick={stopPropagation} className="modal-style">
      <h2>Select a Player</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {generateRows()}
      </div>
    </div>
  );
};

export default ModalComponent;
