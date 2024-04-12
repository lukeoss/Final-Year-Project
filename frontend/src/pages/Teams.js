import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTeam } from '../components/TeamContext';
import { fetchTeams } from '../apiService';
import './Additional.css';
import './Account.css';

const Teams = () => {
  const { setTeam } = useTeam();
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamsData = await fetchTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchData();
  }, []);

  const viewTeam = (teamId) => {
    setSelectedTeamId(teamId);
  };

  const closeTeamView = () => {
    setSelectedTeamId(null);
  };

  const handleDelete = () => {
    setSelectedTeamId(null);
  };

  const renderTeams = () => {
    return teams.map((team) => (
      <div key={team.id}>
        <div className="card border-left shadow h-100 py-2">
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2" style={{ paddingLeft: '15px' }}>
                <div className="h4 font-weight-bold text-primary text-uppercase mb-1">{team.team_name}</div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">{team.players.length} Players</div>
              </div>
              <div className="col-auto" style={{ paddingRight: '15px' }}>
                <div className="button-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button onClick={() => viewTeam(team.id)} className="btn btn-info shadow-sm d-block text-white">
                    <i className="fas fa-eye fa-sm text-white-50"></i> Preview
                  </button>
                  <Link to={`/edit-team/${team.id}`} className="btn btn-warning shadow-sm d-block text-white">
                    <i className="fas fa-edit fa-sm text-white-50"></i> <strike>Edit</strike>
                  </Link>
                  <button onClick={() => handleDelete(team.id)} className="btn btn-danger shadow-sm d-block text-white">
                    <i className="fas fa-trash fa-sm text-white-50"></i> <strike>Delete</strike>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };
  

  const renderPlayerPanel = () => {
    if (!selectedTeamId) return null;
    const team = teams.find((t) => t.id === selectedTeamId);
    const startingPlayers = team.players.slice(0, 15);
    const reservePlayers = team.players.slice(15);
  
    return (
      <div className="card border-left shadow h-100 py-2">
        <div className="col-auto" style={{ paddingRight: '15px' }}>
            <button onClick={closeTeamView} className="btn btn-sm btn-secondary">
                <i className="fas fa-times"></i> Close
            </button>
        </div>
        <div className="card-body">
          <h6 className="font-weight-bold text-success">Starting Players</h6>
          <ul className="list-group">
            {startingPlayers.map(player => (
              <li key={player.id} className="list-group-item d-flex justify-content-between align-items-center">
                ({player.player_number}): {player.player_first_name} {player.player_last_name}
                <span>
                  <span className="badge badge-primary badge-pill">{player.position}</span>
                  <Link to={`/playerprofile/${player.id}`} className="btn btn-sm btn-primary shadow-sm ml-2">
                    View
                  </Link>
                </span>
              </li>
            ))}
          </ul>
          <h6 className="font-weight-bold text-success">Reserves</h6>
          <ul className="list-group">
            {reservePlayers.map(player => (
              <li key={player.id} className="list-group-item d-flex justify-content-between align-items-center">
                ({player.player_number}): {player.player_first_name} {player.player_last_name}
                <Link to={`/playerprofile/${player.id}`} className="btn btn-sm btn-primary shadow-sm">
                  <i className="fas fa-arrow-right fa-sm text-white-50"></i> Profile
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4" style={{ paddingTop: '15px' }}>
        <h1 className="h3 mb-0 text-gray-800">Team Management</h1>
        <Link to="/create-team" className="btn btn-sm btn-success shadow-sm">
          <i className="fas fa-plus fa-sm text-white-50"></i> Create New Team
        </Link>
      </div>
      <div className="row">
        <div className="col-xl-6 col-md-6 mb-6">
            {renderTeams()}
            </div>
            <div className="col-6">
            {renderPlayerPanel()}
            </div>
        </div>
    </div>
  );
};

export default Teams;
