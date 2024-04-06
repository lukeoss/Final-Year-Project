import React from "react";
import { Link } from 'react-router-dom';
import startGameImg from '../ball_in_ski.jpg';
import viewGameImg from '../stadium_corner.jpg';
import "./Additional.css";
import "./Account.css";

const StageGame = () => {
    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4" style={{ paddingTop: '15px' }}>
                <h1 className="h3 mb-0 text-gray-800">Games</h1>
            </div>

            <div className="row" style={{ padding: '0 50px'}}>
                {/* Start Game Card */}
                <div className="col-sm-6 col-xl-6" style={{ marginBottom: '25px' }}>
                    <Link to="/newgame" className="card shadow text-decoration-none" style={{ borderRadius: '15px', overflow: 'hidden', position: 'relative' }}>
                        <img src={startGameImg} alt="Start a new game" style={{ width: '100%', height: 'auto', borderRadius: '15px' }} />
                        <div className="position-absolute">
                            <div className="btn btn-lg text-white bg-black" aria-label="Start a new game">
                                <i className="fas fa-play mr-2"></i>Start New Game
                            </div>
                        </div>
                    </Link>
                </div>

                {/* View Games Card */}
                <div className="col-sm-6 col-xl-6" style={{ marginBottom: '25px' }}>
                    <Link to="/pastgames" className="card shadow text-decoration-none" style={{ borderRadius: '15px', overflow: 'hidden', position: 'relative' }}>
                        <img src={viewGameImg} alt="View past games" style={{ width: '100%', height: 'auto', borderRadius: '15px' }} />
                        <div className="position-absolute">
                            <div className="btn btn-lg text-white bg-black" aria-label="View past games">
                                <i className="fas fa-eye mr-2"></i>View Past Games
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default StageGame;
