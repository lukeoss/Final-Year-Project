import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EventsList from '../components/EventsList/EventsList';
import Pitch from '../components/Pitch/Pitch';
import '../components/Pitch/pitch_style.css';

function Game() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [isPitchClickable, setIsPitchClickable] = useState(false);
  const [blurActive, setBlurActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [pendingDeletes, setPendingDeletes] = useState([]);
  const [markersToRemove, setMarkersToRemove] = useState([]);


  const handleActionSelection = (actionType) => {
    setSelectedAction(actionType);
    setIsPitchClickable(true);
    setBlurActive(true);
  };

  const handleMarkerPlacement = (action, playerNumber) => {
    const eventId = Date.now(); // Generate a unique ID for the event
    const newEvent = createEvent(action, playerNumber, eventId);
    addEvent(newEvent);
    setIsPitchClickable(false);
    setBlurActive(false);
  };

  const createEvent = (action, playerNumber, eventId) => ({
    id: eventId,
    message: `${action} by Player ${playerNumber} at ${new Date().toLocaleTimeString()}`,
    timestamp: Date.now(),
    flagged: false
  });
  

  const addEvent = (event) => {
    setEvents(prevEvents => [event, ...prevEvents]);
  };

  const toggleEventFlag = (id) => {
    setEvents(events => events.map(event => 
      event.id === id ? { ...event, flagged: !event.flagged } : event
    ));
  };

  const initiateDeleteEvent = (id) => {
    const countdownTime = 3; // in seconds
    setPendingDeletes(prev => [...prev, { id, timer: setTimeout(() => finalizeDelete(id), countdownTime * 1000), countdown: countdownTime }]);

    const interval = setInterval(() => {
      setPendingDeletes(prev => prev.map(item => {
        if (item.id === id) {
          const updatedCountdown = item.countdown - 1;
          return { ...item, countdown: updatedCountdown > 0 ? updatedCountdown : 0 };
        }
        return item;
      }));
    }, 1000);

    setTimeout(() => clearInterval(interval), countdownTime * 1000);
  };

  const undoDeleteEvent = (id) => {
    const item = pendingDeletes.find(pd => pd.id === id);
    if (item) {
      clearTimeout(item.timer);
    }
    setPendingDeletes(prev => prev.filter(pd => pd.id !== id));
  };

  const finalizeDelete = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    setPendingDeletes(prev => prev.filter(pd => pd.id !== id));
    setMarkersToRemove(prev => [...prev, id]);
  };

  useEffect(() => {
    return () => pendingDeletes.forEach(pd => clearTimeout(pd.timer));
  }, [pendingDeletes]);

  return (
    <Container fluid className="p-0">
      <Row noGutters className="flex-nowrap">
        <Col md={2} className={`d-flex flex-column align-items-center p-2 action-buttons-column ${blurActive ? 'blur-effect' : ''}`}>
          {['Goal', 'Point', 'Miss', 'Block', 'Foul'].map(actionType => (
            <Button key={actionType} variant="primary" className="my-1" onClick={() => handleActionSelection(actionType)}>
              {actionType}
            </Button>
          ))}
        </Col>

        <Col md={7} className="d-flex justify-content-center p-2">
          <Pitch 
          onMarkerPlaced={handleMarkerPlacement}
          isClickable={isPitchClickable} 
          selectedAction={selectedAction} 
          markersToRemove={markersToRemove}
          clearMarkersToRemove={() => setMarkersToRemove([])}
          />
        </Col>

        <Col md={3} className={`d-flex flex-column align-items-center p-2 ${blurActive ? 'blur-effect' : ''}`}>
          <EventsList
            events={events}
            onFlag={toggleEventFlag}
            onDelete={initiateDeleteEvent}
            onUndo={undoDeleteEvent}
            pendingDeletes={pendingDeletes}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Game;
