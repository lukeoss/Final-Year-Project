import React, { useEffect, useRef } from 'react';
import pitchImageSrc from './pitch_blacklines.jpg';

const PitchCanvas = ({ events }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pitchImage = new Image();

    const normalizedEvents = events.map(event => {
      const coord_x = event.play_direction === "Right" ? 100 - event.coord_x : event.coord_x;
      const coord_y = event.play_direction === "Right" ? 100 - event.coord_y : event.coord_y;
      return { ...event, coord_x, coord_y };
    });

    const drawEvents = () => {
      ctx.drawImage(pitchImage, 0, 0, canvas.width, canvas.height);
      normalizedEvents.forEach(event => {
        ctx.fillStyle = getEventColor(event.event_type);
        ctx.beginPath();
        ctx.arc(
          (event.coord_x / 100) * canvas.width,
          (event.coord_y / 100) * canvas.height,
          10, 0, 2 * Math.PI
        );
        ctx.fill();
      });
    };

    pitchImage.onload = () => {
      canvas.width = pitchImage.width;
      canvas.height = pitchImage.height;
      drawEvents();
    };

    pitchImage.src = pitchImageSrc;

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      normalizedEvents.forEach(event => {
        const eventX = (event.coord_x / 100) * canvas.width;
        const eventY = (event.coord_y / 100) * canvas.height;
        if (Math.sqrt((x - eventX) ** 2 + (y - eventY) ** 2) <= 10) {
          alert(`Clicked on event: ${event.event_type} by ${event.player_id} at ${event.time}`);
        }
      });
    };

    canvas.addEventListener('click', handleClick);

    return () => canvas.removeEventListener('click', handleClick);
  }, [events]);

  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'Goal':
        return '#169b6b';
      case 'Point':
        return '#f6c23e';
      case 'Miss':
        return '#e74a3b';
      case 'Block':
        return 'blue';
      case 'Foul':
        return '#858796';
      default:
        return 'blue';
    }
  };

  return (
    
    <div className="container-fluid">
      <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%' }}/>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      {['Goal', 'Point', 'Miss', 'Block', 'Foul'].map((eventType) => (
          <div key={eventType} style={{ textAlign: 'center', marginRight: '20px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: getEventColor(eventType), display: 'inline-block' }}></div>
            <div style={{ marginTop: '5px' }}>{eventType}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PitchCanvas;
