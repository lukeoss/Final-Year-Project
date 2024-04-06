import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPlayer } from '../../apiService';
import LoadingComp from '../LoadingComp/LoadingComponent.js';
import '../../pages/Additional.css';
import '../../pages/Account.css';

const PlayerProfile = () => {
    const { playerId } = useParams();
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const loadPlayerData = async () => {
            try {
                const playerData = await fetchPlayer(playerId);
                setPlayer(playerData);
            } catch (error) {
                console.error('Error fetching player details:', error);
            }
        };

        loadPlayerData();
    }, [playerId]);

    if (!player) return <LoadingComp />;

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4" style={{ paddingTop: '15px' }}>
                <h1 className="h3 mb-0 text-gray-800">{player.player_first_name} {player.player_last_name}</h1>
                <Link to="/past-games" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                    <i className="fas fa-arrow-left fa-sm text-white-50"></i> Back to Team
                </Link>
            </div>


            <div className="row">
                <div className="col">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Matches</h6>
                        </div>
                        <div className="card-body">
                            <p>Placeholder for player's matches.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerProfile;
