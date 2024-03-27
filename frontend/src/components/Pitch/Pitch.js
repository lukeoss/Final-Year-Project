import React, { useState } from 'react';
import pitchImage from './Pitch_image.png';
import goalIcon from './goal_icon.png';
import pointIcon from './point_icon.png';
import missIcon from './miss_icon.png';
import blockIcon from './block_icon.png';
import foulIcon from './foul_icon.png';
import ModalComponent from '../Modal/Modal';

export const Pitch = ({ onMarkerPlaced, isClickable, selectedAction, markers, players }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [temporaryMarker, setTemporaryMarker] = useState(null);

  const handlePitchClick = (event) => {
    if (!isClickable || isModalOpen) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const tempMarker = { x, y, action: selectedAction, id: Date.now() };
    setTemporaryMarker(tempMarker);
    setIsModalOpen(true);
  };

  const handleModalClose = (playerNumber) => {
    if (temporaryMarker) {
      onMarkerPlaced(selectedAction, playerNumber, temporaryMarker);
    }
    setIsModalOpen(false);
    setTemporaryMarker(null);
  };

  const getMarkerIcon = (action) => {
    switch (action) {
      case 'Goal': return goalIcon;
      case 'Point': return pointIcon;
      case 'Miss': return missIcon;
      case 'Block': return blockIcon;
      case 'Foul': return foulIcon;
      default: return missIcon;
    }
  };

  return (
    <div className="Pitch" onClick={handlePitchClick} style={{ position: 'relative' }}>
      <img src={pitchImage} alt="Pitch" style={{ maxWidth: '100%', height: 'auto' }} />
      {markers.concat(temporaryMarker ? [temporaryMarker] : []).map((marker) => (
        <img key={marker.id}
             src={getMarkerIcon(marker.action)}
             alt={marker.action}
             style={{
               position: 'absolute',
               left: `${marker.x}px`,
               top: `${marker.y}px`,
               transform: 'translate(-50%, -50%)',
               width: '3vw',
               height: '3vw'
             }} />
      ))}
      {isModalOpen && <ModalComponent onActionSelected={handleModalClose} players={players} />}
    </div>
  );
};

export default Pitch;
