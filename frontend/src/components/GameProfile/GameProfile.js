import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { fetchMatchDetails, getMatchEvents } from '../../apiService.js';
import PitchCanvas from '../PlotPitch/PitchCanvas.js';
import LoadingComp from '../LoadingComp/LoadingComponent.js';
import '../../pages/Additional.css';
import '../../pages/Account.css';

const GameProfile = () => {
  const { gameId } = useParams();
  const [currentPlotFilter, setPlotCurrentFilter] = useState('Everything ');
  const [matchDetails, setMatchDetails] = useState(null);
  const [matchEvents, setMatchEvents] = useState([]);
  const [eventFilter, setEventFilter] = useState('');

  useEffect(() => {
    const loadMatchData = async () => {
      try {
        const fetchedMatchDetails = await fetchMatchDetails(gameId);
        setMatchDetails(fetchedMatchDetails);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }

      try {
        const fetchedMatchEvents = await getMatchEvents(gameId, true);
        setMatchEvents(fetchedMatchEvents);
      } catch (error) {
        console.error('Error fetching match events:', error);
      }
    };

    loadMatchData();
  }, [gameId]);

  const handleSelectPlot = (e, filterType, filterLabel) => {
    e.preventDefault();
    setEventFilter(filterType);
    setPlotCurrentFilter(filterLabel);
  };

  const filteredEvents = eventFilter
  ? matchEvents.filter(event => event.event_type.toLowerCase() === eventFilter.toLowerCase())
  : matchEvents;

  if (!matchDetails) return <LoadingComp/>;

  return (
    <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4" style={{ paddingTop: '15px' }}>
        <h1 className="h3 mb-0 text-gray-800">Game ID: {gameId}</h1>
        <Link to={`/pastgames`} className="btn btn-sm btn-primary shadow-sm">
          <i className="fas fa-arrow-left fa-sm text-white-50"></i> Back to Past Games
        </Link>

      </div>

      <div className='row'>

      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">
            Event Distribution
            </h6>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic" className="btn btn-sm shadow-sm">
              {currentPlotFilter}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                  <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'goal', 'Goals  ')}>Goals</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'point', 'Points  ')}>Points</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'miss', 'Missed  ')}>Missed</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'block', 'Blocks  ')}>Blocks</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'foul', 'Fouls  ')}>Foul</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={(e) => handleSelectPlot(e, '', 'Everything  ')}>Everything</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
          </div>

          <div className="card-body">
            <PitchCanvas events={filteredEvents} />
          </div>
        </div>
      </div>

      <div className="col-xl-5 col-lg-5">
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">
            Events
            </h6>
          </div>

          <div className="card-body">
          {matchEvents.map((event, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    <strong>{event.time}</strong> - {event.event_type} by {event.player.player_first_name} {event.player.player_last_name} ({event.play_direction})
                </div>
            ))}            
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default GameProfile;