import React, { useState, useEffect } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { compareMatchEvents, fetchPastGames } from '../../apiService';

const MatchComparison = () => {
  const [selectedMatchIdFirst, setSelectedMatchIdFirst] = useState(null);
  const [selectedMatchIdSecond, setSelectedMatchIdSecond] = useState(null);
  const [eventsFirst, setEventsFirst] = useState({ goals: 0, points: 0, misses: 0, blocks: 0, fouls: 0 });
  const [eventsSecond, setEventsSecond] = useState({ goals: 0, points: 0, misses: 0, blocks: 0, fouls: 0 });
  const [eventsDiff, setEventsDiff] = useState({ goals: 0, points: 0, misses: 0, blocks: 0, fouls: 0 });
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await fetchPastGames();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  const handleCompare = async () => {
    if (selectedMatchIdFirst && selectedMatchIdSecond) {
      try {
        const data = await compareMatchEvents(selectedMatchIdFirst, selectedMatchIdSecond);
        setEventsFirst(data.first_match);
        setEventsSecond(data.second_match);
        setEventsDiff(data.differences);
      } catch (error) {
        console.error('Failed to load match comparison data:', error);
      }
    }
  };

  const renderDropdown = (selectedMatchId, setSelectedMatchId) => {
    const match = matches.find(m => m.id === selectedMatchId);
    const label = match ? `${match.formatted_date} - ${match.home_team} vs ${match.away_team}` : "Select Match";

    return (
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {label}
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ overflowY: 'scroll', maxHeight: '204px' }}>
          {matches.map(match => (
            <Dropdown.Item key={match.id} onClick={() => setSelectedMatchId(match.id)}>
              {match.formatted_date} - {match.home_team} vs {match.away_team}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const renderProgress = (value) => {
    const percentage = Math.abs(Math.min(100, (value / Math.max(Math.abs(eventsFirst.goals), Math.abs(eventsSecond.goals))) * 100));
    const isPositive = value > 0;
    const barStyle = {
      width: `${percentage}%`,
      background: isPositive ? 'green' : 'red',
      height: '100%'
    };

    return (
      <div style={{ width: '50px', display: 'flex', alignItems: 'center', justifyContent: isPositive ? 'flex-start' : 'flex-end' }}>
        <div style={barStyle}></div>
      </div>
    );
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header d-flex justify-content-between">
        {renderDropdown(selectedMatchIdFirst, setSelectedMatchIdFirst)}
        <Button onClick={handleCompare} variant="success">Compare</Button>
        {renderDropdown(selectedMatchIdSecond, setSelectedMatchIdSecond)}
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-center align-items-center">
          <div>
            <h5>First Match Events</h5>
            <p>Goals: {eventsFirst.goals}</p>
            <p>Points: {eventsFirst.points}</p>
            <p>Misses: {eventsFirst.misses}</p>
            <p>Blocks: {eventsFirst.blocks}</p>
            <p>Fouls: {eventsFirst.fouls}</p>
          </div>
          {/* Work in progress */}
          <div>
            <h5>Second Match Events</h5>
            <p>Goals: {eventsSecond.goals} ({eventsDiff.goals})</p>
            <p>Points: {eventsSecond.points} ({eventsDiff.points})</p>
            <p>Misses: {eventsSecond.misses} ({eventsDiff.misses})</p>
            <p>Blocks: {eventsSecond.blocks} ({eventsDiff.blocks})</p>
            <p>Fouls: {eventsSecond.fouls} ({eventsDiff.fouls})</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchComparison;