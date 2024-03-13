import React from 'react';
import './modal.css'


const ModalComponent = ({ onActionSelected }) => {
  const layout = [
    [1], [2, 3, 4], [5, 6, 7], [8, 9], [10, 11, 12], [13, 14, 15]
  ];

  // Function to stop click event propagation
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div onClick={stopPropagation} className="modal-style">
      <h2>Select a Player</h2>
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
          {row.map((number) => (
            <button key={number} onClick={() => onActionSelected(number)} style={{ margin: '5px' }}>
            {number}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ModalComponent;
