// Game.js
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTeam } from '../components/TeamContext';
import EventsList from '../components/EventsList/EventsList';
import Pitch from '../components/Pitch/Pitch';
import '../components/Pitch/pitch_style.css';
import { createMatchEvent, deleteMatchEventDB } from '../apiService';

function Game() {
  const location = useLocation();
  const selectedMatchId = location.state?.matchId;
  const { team, selectedTeamId, selectedDirection } = useTeam();
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [isPitchClickable, setIsPitchClickable] = useState(false);
  const [events, setEvents] = useState([]);
  const [pendingDeletes, setPendingDeletes] = useState([]);

  const [playDirection, setPlayDirection] = useState(selectedDirection);

  const swapDirections = () => {
    setPlayDirection(prevDirection => prevDirection === "Left" ? "Right" : "Left");
  };

  const handleActionSelection = (actionType) => {
    setSelectedAction(actionType);
    setIsPitchClickable(true);
  };

  const handleMarkerPlacement = async (action, { playerId, playerNumber }, markerPosition) => {
    const player = team.players.find(p => p.player_number === playerNumber);
    
    if (!player || !player.id) {
      console.error("Player ID is undefined or player not found.");
      return;
    }
  
    const timeNow = new Date().toLocaleTimeString('en-GB', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  
    try {
      const savedEvent = await createMatchEvent({
        event_type: action,
        coord_x: markerPosition.x,
        coord_y: markerPosition.y,
        time: timeNow,
        play_direction: playDirection,
        match: selectedMatchId,
        player: playerId,
      });

      console.log(savedEvent.id)
      addEvent({ ...createEvent(action, player, savedEvent.id, markerPosition), dbId: savedEvent.id });
      // addEvent({ ...createEvent(action, player, markerPosition), dbId: savedEvent.id });  

    } catch (error) {
    console.error('Failed to save event:', error);
    }

    setIsPitchClickable(false);
    setSelectedAction(null);
    
  };  

  const createEvent = (action, player, dbId, markerPosition) => ({
    id: dbId,
    message: `${action} by ${player ? player.player_last_name : 'Unknown Player'} (${player ? player.player_number : 'N/A'}) at ${new Date().toLocaleTimeString()}`,
    timestamp: Date.now(),
    flagged: false,
    markerPosition,
  });

  const addEvent = (event) => {
    setEvents(prevEvents => [event, ...prevEvents]);
  };

  const toggleEventFlag = (dbId) => {
    setEvents(events.map(event => event.dbId === dbId ? { ...event, flagged: !event.flagged } : event));
  };

  const initiateDeleteEvent = (dbId) => {
    const countdownTime = 3;
    const timer = setTimeout(() => finalizeDelete(dbId), countdownTime * 1000);
    setPendingDeletes(prev => [...prev, { dbId, timer, countdown: countdownTime }]);
  };

  const undoDeleteEvent = (dbId) => {
    setPendingDeletes(prev => {
      const item = prev.find(pd => pd.dbId === dbId);
      if (item) {
        clearTimeout(item.timer);
      }
      return prev.filter(pd => pd.dbId !== dbId);
    });
  };

  const finalizeDelete = async (dbId) => {
    setEvents(prev => prev.filter(event => event.dbId !== dbId));
    try {
      await deleteMatchEventDB(dbId);
      setPendingDeletes(prev => prev.filter(pd => pd.dbId !== dbId));
    } catch (error) {
      console.error("Failed to delete event from database:", error);
    }
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
            finalizeDelete(pd.dbId);
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
            <Link to={`/gameprofile/${selectedMatchId}`} className="btn btn-danger my-1">
            End Game
            </Link>
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
