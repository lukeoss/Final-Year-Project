import React, { useState, useEffect } from 'react';
import { useTeam } from '../components/TeamContext';
import EventsList from '../components/EventsList/EventsList';
import Pitch from '../components/Pitch/Pitch';
import '../components/Pitch/pitch_style.css';

function Game() {
  const { team, selectedTeamId, selectedDirection } = useTeam();
  console.log(selectedTeamId, selectedDirection);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [isPitchClickable, setIsPitchClickable] = useState(false);
  const [events, setEvents] = useState([]);
  const [pendingDeletes, setPendingDeletes] = useState([]);

  const [playDirection, setPlayDirection] = useState(selectedDirection);

  const swapDirections = () => {
    if (playDirection === "Left") {
      setPlayDirection("Right")
    }
    else {
      setPlayDirection("Left")
    }
  };

  const handleActionSelection = (actionType) => {
    const actionId = Date.now();
    setSelectedAction(actionType);
    setSelectedActionId(actionId);
    setIsPitchClickable(true);
  };

  const handleMarkerPlacement = (action, playerNumber, markerPosition) => {
    const player = team.players.find(p => p.player_number === playerNumber);
    const newEvent = createEvent(action, player, selectedActionId, markerPosition);
    addEvent(newEvent);
    setIsPitchClickable(false);
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
    setEvents(events.map(event => event.id === id ? { ...event, flagged: !event.flagged } : event));
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
    <div className="container-fluid p-0">
    <div className="row flex-nowrap">
  
        <div className="col-md-2 p-2 action-buttons-column">

          <div className="card h-100" style={{ marginLeft: '15px' }}>
            <div className="card-body d-flex flex-column justify-content-around align-items-center" style={{ overflowX: 'hidden' }}>
            {['Goal', 'Point', 'Miss', 'Block', 'Foul'].map(actionType => (
              <button key={actionType} className="btn btn-primary my-1" style={{ minWidth: '100px' }} onClick={() => handleActionSelection(actionType)}>
              {actionType}
              </button>
            ))}
            </div>
          </div>

          <div className="card h-100" style={{ marginTop: '15px', marginLeft: '15px' }}>
            <div className="card-body d-flex flex-column justify-content-around align-items-center" style={{ overflowX: 'hidden' }}>
            <h5>Shooting: {playDirection}</h5>
            <button className="btn btn-primary my-1"
            onClick={() => swapDirections()}
            >
            Swap Sides
            </button>
            </div>
          </div>

          <div className="card h-100" style={{ marginTop: '15px', marginLeft: '15px' }}>
            <div className="card-body d-flex flex-column justify-content-around align-items-center" style={{ overflowX: 'hidden' }}>
            <button className="btn btn-primary my-1">
            Substitution
            </button>
            </div>
          </div>

        </div>


      <div className="col-md-7 p-2">
          <Pitch 
            onMarkerPlaced={handleMarkerPlacement} 
            isClickable={isPitchClickable} 
            selectedAction={selectedAction} 
            selectedActionId={selectedActionId}
            markers={events.map(event => ({ ...event.markerPosition, id: event.id }))}
          />
      </div>
  
      <div className="col-md-3 p-2">
        <div className="card h-100" style={{ overflowY: 'auto', marginRight: '15px'}}>
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Events</h6>
                        </div>
          <div className="card-body d-flex flex-column align-items-center">
            <EventsList
              events={events}
              onFlag={toggleEventFlag}
              onDelete={initiateDeleteEvent}
              onUndo={undoDeleteEvent}
              pendingDeletes={pendingDeletes}
            />
          </div>
        </div>
      </div>
  
    </div>
  </div>
  

  );
}


export default Game;
