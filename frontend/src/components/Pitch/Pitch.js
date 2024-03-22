import React, { useState } from 'react';
import pitchImage from './Pitch_image.png';
import goalIcon from './goal_icon.png';
import pointIcon from './point_icon.png';
import missIcon from './miss_icon.png';
import blockIcon from './block_icon.png';
import foulIcon from './foul_icon.png';
import ModalComponent from '../Modal/Modal';

export const Pitch = ({ onMarkerPlaced, isClickable, selectedAction, markersToRemove, clearMarkersToRemove }) => {
  const [markers, setMarkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePitchClick = (event) => {
      if (!isClickable || isModalOpen) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      const newMarker = { x, y, action: selectedAction }; // Include action directly here
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]); // Add the marker directly to the list
      setIsModalOpen(true);
  };

  const handleActionSelected = (playerNumber) => {
      setIsModalOpen(false);

      if (typeof onMarkerPlaced === 'function') {
        onMarkerPlaced(selectedAction, playerNumber);
      }
  };

  const getMarkerIcon = (action) => {
    switch (action) {
      case 'Goal':
        return goalIcon;
      case 'Point':
        return pointIcon;
      case 'Miss':
        return missIcon;
      case 'Block':
        return blockIcon;
      case 'Foul':
        return foulIcon;
      default:
        return missIcon;
    }
  };

  return (
    <div className="Pitch" onClick={handlePitchClick} style={{ position: 'relative' }}>
      <img src={pitchImage} alt="Pitch" style={{ maxWidth: '100%', height: 'auto' }} />
        {markers.map((marker, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${marker.x}px`,
              top: `${marker.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <img src={getMarkerIcon(marker.action)} alt={marker.action} style={{ width: '3vw', height: '3vw' }} />
          </div>
        ))}
        {isModalOpen && <ModalComponent onActionSelected={handleActionSelected} />}
    </div>
  );
};

export default Pitch;
