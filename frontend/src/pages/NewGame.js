import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTeam } from '../components/TeamContext';
import "./Additional.css";
import "./Account.css";

const apiBaseURL = 'http://localhost:8000/api/';

const NewGame = () => {

    const { setTeam } = useTeam(); 
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState(null);

    const countPlayersInTeam = (teamId) => {
        const team = teams.find(team => team.team_id === teamId);
        return team ? team.players.length : 0;
    };
    
    const handleTeamSelect = (teamId) => {
        const team = teams.find(t => t.team_id === teamId);
        setTeam(team);
        setSelectedTeamId(teamId);
    };
      
    const fetchData = async () => {
        try {
            const response = await fetch(`${apiBaseURL}teams/`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setTeams(data);
            const allPlayers = data.reduce((acc, team) => [...acc, ...team.players], []);
            setPlayers(allPlayers);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const generateRows = () => {
  
        if (!selectedTeamId) {
            return (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center"  
                     style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
                    Please select a team.
                </div>
            );
        }

        const selectedTeamPlayers = players.filter(player => player.player_team_id === selectedTeamId);

        if (!selectedTeamPlayers.length) return null;
        
        return rowStructures.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="row justify-content-center" 
                 style={{ marginBottom: '10px' }}>
                {row.map(playerNumber => {

                    const player = selectedTeamPlayers.find(player => player.player_number === playerNumber);
    
                    return (
                        <div key={playerNumber} className="col-auto mb-2" 
                             style={{ padding: '0 5px' }}>
                            <div className="card" style={{ width: '100px' }}>
                                <div className="card-body d-flex justify-content-center align-items-center" 
                                     style={{ padding: '10px' }}>
                                    <div className="text-center" style={{ fontSize: '0.8rem' }}>
                                        {player ? player.player_last_name : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        ));
    };
    

    const rowStructures = [
        [1], [2, 3, 4], [5, 6, 7], [8, 9], [10, 11, 12], [13, 14, 15],
    ];


    return (
        <div className="container-fluid">

            <div className="d-sm-flex align-items-center justify-content-between mb-4" style={{ paddingTop: '15px' }}>
                            <h1 className="h3 mb-0 text-gray-800">Start a Game</h1>
                        </div>

            <div className="row">

            <div className="col-xl-6 col-lg-7">
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">Select Team</h6>
                    </div>
                    <div className="card-body">
                        {teams.map(team => (
                            <div key={team.team_id} className="mb-4">
                                <div className="card border-left shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col" style={{ paddingLeft: '15px' }}>
                                                <div className="h4 font-weight-bold text-primary text-camelcase mb-1">{team.team_name}</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{countPlayersInTeam(team.team_id)} Players</div>
                                            </div>
                                            <div className="col-auto" style={{ paddingRight: '15px' }}>
                                                <div className="button-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                <Link className={`btn shadow-sm d-block text-white ${selectedTeamId === team.team_id ? 'btn-success' : 'btn-primary'}`} style={{ width: '100%' }} onClick={() => handleTeamSelect(team.team_id)}>
                                                    <i className={`fas ${selectedTeamId === team.team_id ? '' : 'fa-hand-pointer'} fa-sm text-white-50`}></i> {selectedTeamId === team.team_id ? "Selected" : 'Select'}
                                                </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2"  style={{ paddingLeft: '15px' }}>
                                    <div className="h5 font-weight-bold text-success text-camelcase mb-1">
                                        Starting Panel</div>
                                </div>
                                <div className="col-auto" style={{ paddingRight: '15px' }}>
                                    <i className="fas fa-people-group fa-2x text-gray-300"></i>
                                </div>

                                <div className="container-fluid">
                                    {generateRows()}
                                </div>

                                <div className="form-check mt-3 ml-2 custom-checkbox">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        Advanced Mode
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left shadow py-2">
                        <div className="card-body d-flex align-items-center justify-content-center" style={{ padding: 25 }}>
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                <div className="button-group w-100 h-100" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
                                <Link to={{ pathname: "/game", state: { selectedTeamId: selectedTeamId }
                                    }} className={`btn ${selectedTeamId ? 'btn-primary' : 'btn-secondary'} shadow-sm d-flex align-items-center justify-content-center text-white`} style={{ width: '100%', height: '100%' }} onClick={(e) => selectedTeamId ? null : e.preventDefault()}>
                                        Start Game
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div> {/* End Row */}

        </div>
            
    );

}

export default NewGame;