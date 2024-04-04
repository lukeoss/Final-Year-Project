// Pitch.js
import React, { useState, useRef } from 'react';
import pitchImage from './Pitch_image.png';
import goalIcon from './goal_icon.png';
import pointIcon from './point_icon.png';
import missIcon from './miss_icon.png';
import blockIcon from './block_icon.png';
import foulIcon from './foul_icon.png';
import ModalComponent from '../Modal/Modal';

import './pitch_style.css'

export const Pitch = ({ onMarkerPlaced, isClickable, selectedAction, markers, players }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [temporaryMarker, setTemporaryMarker] = useState(null);
  const pitchRef = useRef(null);

  const handlePitchClick = (event) => {
    if (!isClickable || isModalOpen) return;

    const pitchImg = pitchRef.current;
    if (pitchImg) {
      const bounds = pitchImg.getBoundingClientRect();
      const xPercent = ((event.clientX - bounds.left) / bounds.width) * 100;
      const yPercent = ((event.clientY - bounds.top) / bounds.height) * 100;
      const tempMarker = { x: xPercent, y: yPercent, action: selectedAction, id: Date.now() };
      setTemporaryMarker(tempMarker);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = (playerInfo) => {
    if (temporaryMarker && playerInfo) {
      onMarkerPlaced(selectedAction, { playerId: playerInfo.playerId, playerNumber: playerInfo.playerNumber }, temporaryMarker);
    } else {
      console.error("Player information is missing.");
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
      <img ref={pitchRef} src={pitchImage} alt="Pitch" style={{ maxWidth: '100%', height: 'auto' }} />
      {markers.concat(temporaryMarker ? [temporaryMarker] : []).map((marker) => (
        <img key={marker.id}
             src={getMarkerIcon(marker.action)}
             alt={marker.action}
            //  className="marker-img"
            //  onLoad={(e) => e.currentTarget.classList.add('marker-img-loaded')}
             style={{
               position: 'absolute',
               left: `${marker.x}%`,
               top: `${marker.y}%`,
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
