import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { fetchPastGames } from '../apiService';
import './Additional.css';
import './Account.css';

const PastGames = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const loadGames = async () => {
      const fetchedGames = await fetchPastGames();
      setGames(fetchedGames);
    };

    loadGames();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-secondary">Past Games</h1>
        <Link to={`/stagegames`} className="btn btn-sm btn-primary shadow-sm">
          <i className="fas fa-arrow-left fa-sm text-white-50"></i> Back to Games
        </Link>
      </div>

      <Card className="shadow-sm rounded">
        <Card.Body>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="text-primary">Team</th>
                  <th className="text-primary">Date</th>
                  <th className="text-primary">Action</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game.id}>
                    <td>{game.team_name}</td>
                    <td>{game.formatted_date}</td>
                    <td><Link to={`/gameprofile/${game.id}`} className="btn btn-primary btn-icon-split">View Game</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PastGames;
