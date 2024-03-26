import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTeam } from '../components/TeamContext';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EventsList from '../components/EventsList/EventsList';
import Pitch from '../components/Pitch/Pitch';
import '../components/Pitch/pitch_style.css';

function Game() {
  const { team } = useTeam(); // Using team from context
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [isPitchClickable, setIsPitchClickable] = useState(false);
  const [blurActive, setBlurActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [pendingDeletes, setPendingDeletes] = useState([]);

  const handleActionSelection = (actionType) => {
    const actionId = Date.now();
    setSelectedAction(actionType);
    setSelectedActionId(actionId);
    setIsPitchClickable(true);
    setBlurActive(true);
  };

  const handleMarkerPlacement = (action, playerNumber, markerPosition) => {
    // Use team.players directly from context
    const player = team.players.find(p => p.player_number === playerNumber);
    const newEvent = createEvent(action, player, selectedActionId, markerPosition);
    addEvent(newEvent);
    setIsPitchClickable(false);
    setBlurActive(false);
    setSelectedActionId(null);
  };

  const createEvent = (action, player, eventId, markerPosition) => ({
    id: eventId,
    message: `${action} by ${player ? player.player_last_name : 'Unknown Player'} (${player ? player.player_number : 'N/A'}) at ${new Date().toLocaleTimeString()}`,
    timestamp: Date.now(),
    flagged: false,
    markerPosition,
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
    const countdownTime = 3;
    const timer = setTimeout(() => finalizeDelete(id), countdownTime * 1000);
    setPendingDeletes(prev => [...prev, { id, timer, countdown: countdownTime }]);
  };

  const undoDeleteEvent = (id) => {
    setPendingDeletes(prev => {
      const item = prev.find(pd => pd.id === id);
      if (item) {
        clearTimeout(item.timer);
      }
      return prev.filter(pd => pd.id !== id);
    });
  };

  const finalizeDelete = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    setPendingDeletes(prev => prev.filter(pd => pd.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPendingDeletes((prev) => {
        return prev.map(pd => ({
          ...pd,
          countdown: pd.countdown - 1
        })).filter(pd => {
          if (pd.countdown < 1) {
            clearTimeout(pd.timer);
            finalizeDelete(pd.id);
            return false;
          }
          return true;
        });
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      pendingDeletes.forEach(pd => clearTimeout(pd.timer));
    };
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
            selectedActionId={selectedActionId}
            markers={events.map(event => ({...event.markerPosition, id: event.id}))}
          />
        </Col>
        <Col md={3} className={`d-flex flex-column align-items-center p-2 ${blurActive ? 'blur-effect' : ''}`}>
          <EventsList
            events={events}
            onFlag={toggleEventFlag}
            onDelete={initiateDeleteEvent}
            onUndo={undoDeleteEvent}
            pendingDeletes={pendingDeletes}
            // players={players}
          />
        </Col>
      </Row>
    </Container>
  );
}


export default Game;
