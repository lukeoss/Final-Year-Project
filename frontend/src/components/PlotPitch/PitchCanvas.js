import React, { useEffect, useRef, useState } from 'react';
import pitchImageSrc from './pitch_blacklines.jpg';
import { fetchMatchEvents } from '../../apiService.js';

const PitchCanvas = ({ filter }) => {
  const canvasRef = useRef(null);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await fetchMatchEvents();
        const normalizedEvents = data.map(event => {
          let coord_x, coord_y;
          if (event.play_direction === "Right") {
            coord_x = 100 - event.coord_x;
            coord_y = 100 - event.coord_y;
          } else {
            coord_x = event.coord_x;
            coord_y = event.coord_y;
          }
    
          return {
            ...event,
            coord_x: coord_x,
            coord_y: coord_y
          };
        });
    
        setAllEvents(normalizedEvents);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
    
    fetchEventData();
  }, []);

  useEffect(() => {
    const applyFilter = () => {
      setFilteredEvents(filter
        ? allEvents.filter(event => event.event_type.toLowerCase() === filter.toLowerCase())
        : allEvents.filter(event => event.event_type !== 'Block' && event.event_type !== 'Foul')
      );
    };

    applyFilter();
  }, [filter, allEvents]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pitchImage = new Image();

    pitchImage.onload = () => {
      canvas.width = pitchImage.width;
      canvas.height = pitchImage.height;
      ctx.drawImage(pitchImage, 0, 0, canvas.width, canvas.height);

      filteredEvents.forEach(event => {
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

    pitchImage.src = pitchImageSrc;
  }, [filteredEvents]);

  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'Goal':
        return '#169b6b';
      case 'Point':
        return '#f6c23e';
      case 'Miss':
        return '#e74a3b';
      default:
        return 'blue';
    }
  };

  return <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%' }}/>;
};

export default PitchCanvas;
