import React, { useEffect, useRef } from 'react';
import pitchImageSrc from './pitch_blacklines.jpg';

const PitchCanvas = ({ events }) => {
  const canvasRef = useRef(null);

  function drawHexagon(ctx, x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(x + size * Math.cos((i * 2 * Math.PI) / 6), y + size * Math.sin((i * 2 * Math.PI) / 6));
    }
    ctx.closePath();
  }

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
        const x = (event.coord_x / 100) * canvas.width;
        const y = (event.coord_y / 100) * canvas.height;
        const size = 10;
        ctx.fillStyle = getEventColor(event.event_type);

        switch (event.event_type) {
          case 'Goal':
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
            break;
          case 'Point':
              const height = size * Math.sqrt(3);
              ctx.beginPath();
              ctx.moveTo(x - size, y + height / 3);
              ctx.lineTo(x + size, y + height / 3);
              ctx.lineTo(x, y - 2 * height / 3);
              ctx.closePath();
              ctx.fill();
              break;
          case 'Miss':
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.stroke();
            break;
          case 'Block':
            const wth = size * 1.5;
            const hht = size * 1.5;
            ctx.beginPath();
            ctx.fillRect(x - wth / 2, y - hht / 2, wth, hht);
            ctx.fill();
            break;
          case 'Foul':
            drawHexagon(ctx, x, y, size);
            ctx.fill();
            break;
          default:
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
        }
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
        return '#ad0000';
      default:
        return 'blue';
    }
  };

  const drawLegendShape = (canvas, eventType, color) => {
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    const size = 10;
    const x = canvas.width / 2;
    const y = canvas.height / 2;
  
    ctx.fillStyle = color;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    switch (eventType) {
      case 'Goal':
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'Point':
          const height = size * Math.sqrt(3);
          ctx.beginPath();
          ctx.moveTo(x - size, y + height / 3);
          ctx.lineTo(x + size, y + height / 3);
          ctx.lineTo(x, y - 2 * height / 3);
          ctx.closePath();
          ctx.fill();
          break;
      case 'Miss':
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        eventType === 'Goal' ? ctx.fill() : ctx.stroke();
        break;
      case 'Block':
        const wth = size * 1.5;
        const hht = size * 1.5;
        ctx.beginPath();
        ctx.fillRect(x - wth / 2, y - hht / 2, wth, hht);
        ctx.fill();
        break;
      case 'Foul':
        drawHexagon(ctx, x, y, size);
        ctx.fill();
        break;
      default:
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
  };
    
  return (
    
    <div className="container-fluid">
      <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%' }}/>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {['Goal', 'Point', 'Miss', 'Block', 'Foul'].map((eventType) => {
          const color = getEventColor(eventType);

          return (
            <div key={eventType} style={{ textAlign: 'center', marginRight: '20px' }}>
              <canvas ref={el => drawLegendShape(el, eventType, color)} width="40" height="40"></canvas>
              <div style={{ marginTop: '5px' }}>{eventType}</div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default PitchCanvas;
