import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../components/TeamContext';
import { createMatch } from '../apiService';

import "./Additional.css";
import "./Account.css";

const apiBaseURL = 'http://localhost:8000/api/';

const Teams = () => {
    const { setTeam, selectedTeamId, setSelectedTeamId, selectedDirection, setSelectedDirection } = useTeam();
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);

    const rowStructures = [
        [1], [2, 3, 4], [5, 6, 7], [8, 9], [10, 11, 12], [13, 14, 15],
    ];

    const handleDelete = async (teamId) => {
        try {
            // Ideally, connect this function to delete the team from your backend/database
            await fetch(`${apiBaseURL}teams/${teamId}`, { method: 'DELETE' });
            setTeams(teams.filter(team => team.id !== teamId));
        } catch (error) {
            console.error('Failed to delete team:', error);
        }
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

    const renderTeams = () => {
        return teams.map((team) => (
            <div key={team.id} className="col-xl-4 col-md-6 mb-4">
                <div className="card border-left shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2" style={{ paddingLeft: '15px' }}>
                                <div className="h4 font-weight-bold text-primary text-uppercase mb-1">{team.name}</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{team.players} Players</div>
                            </div>
                            <div className="col-auto" style={{ paddingRight: '15px' }}>
                                <div className="button-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Link to={`/edit-team/${team.id}`} className="btn btn-warning shadow-sm d-block text-white">
                                        <i className="fas fa-edit fa-sm text-white-50"></i> Edit
                                    </Link>
                                    <button onClick={() => handleDelete(team.id)} className="btn btn-danger shadow-sm d-block text-white">
                                        <i className="fas fa-trash fa-sm text-white-50"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4" style={{ paddingTop: '15px' }}>
                <h1 className="h3 mb-0 text-gray-800">Team Management</h1>
                <Link to="/create-team" className="btn btn-sm btn-success shadow-sm"><i className="fas fa-plus fa-sm text-white-50"></i> Create New Team</Link>
            </div>
            <div className="row">
                {renderTeams()}
            </div>
        </div>
    );
};

export default Teams;
