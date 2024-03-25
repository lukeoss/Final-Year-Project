import React, { useState, useEffect } from "react";
// import { Route, Outlet, useNavigate } from "react-router-dom";
import {Link } from "react-router-dom";

// import { Dropdown } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import Game from "./Game.js"
import "./Additional.css";
import "./Account.css";


const NewGame = () => {

    const lastNames = [
        null, // Placeholder
        "Mohan", "Fallon", "Mac Suibhne", "Davin", "Desmond",
        "McGuinness", "Ó hEaghra", "Daley", "Ó Maol Bhréanáin",
        "Shannon", "Caden", "McAfee", "Ó Téacháin", "Ó Deoradháin", "McCracken",
    ];

    const rowStructures = [
        [1], [2, 3, 4], [5, 6, 7], [8, 9], [10, 11, 12], [13, 14, 15],
    ];

    const generateRows = () => {
        return rowStructures.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="row justify-content-center" style={{ marginBottom: '10px' }}> {/* Spacing between rows */}
                {row.map((nameIndex) => (
                    <div key={nameIndex} className={`col-auto mb-2`} style={{ padding: '0 5px' }}> {/* 10px spacing between boxes below */}
                        <div className="card" style={{ width: '100px' }}>
                            <div className="card-body d-flex justify-content-center align-items-center" style={{ padding: '10px' }}> {/* Reduced vertical padding */}
                                <div className="text-center" style={{ fontSize: '0.8rem' }}>
                                    {lastNames[nameIndex]}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ));
    };

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
                            
                            <div className="col-xl-12 col-md-6 mb-4"> {/* Start Internal Card */}
                                <div className="card border-left shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2"  style={{ paddingLeft: '15px' }}>
                                                <div className="h4 font-weight-bold text-warning text-camelcase mb-1">Junior Womens Camogie Team</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">25 Players</div>
                                            </div>
                                            <div className="col-auto" style={{ paddingRight: '15px' }}>
                                                <div className="button-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <Link to="#" className="btn btn-primary shadow-sm d-block text-white" style={{ width: '100%' }}>
                                                        <i className="fas fa-hand-pointer fa-sm text-white-50"></i> Select
                                                    </Link>
                                                    <Link to="#" className="btn btn-primary shadow-sm d-block text-white" style={{ width: '100%' }}>
                                                        <i className="fas fa-pen-to-square fa-sm text-white-50"></i> Edit
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>  {/* End Internal Card */}

                            <div className="col-xl-12 col-md-6 mb-4"> {/* Start Internal Card */}
                                <div className="card border-left shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2"  style={{ paddingLeft: '15px' }}>
                                                <div className="h4 font-weight-bold text-primary text-camelcase mb-1">Junior Mens Hurling Team</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">27 Players</div>
                                            </div>
                                            <div className="col-auto" style={{ paddingRight: '15px' }}>
                                                <div className="button-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <Link to="#" className="btn btn-primary shadow-sm d-block text-white" style={{ width: '100%' }}>
                                                        <i className="fas fa-hand-pointer fa-sm text-white-50"></i> Select
                                                    </Link>
                                                    <Link to="#" className="btn btn-primary shadow-sm d-block text-white" style={{ width: '100%' }}>
                                                        <i className="fas fa-pen-to-square fa-sm text-white-50"></i> Edit
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> {/* End Internal Card */}

                            <div className="col-xl-12 col-md-6 mb-4"> {/* Start Internal Card */}
                                <div className="card border-left shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2"  style={{ paddingLeft: '15px' }}>
                                                <div className="h4 font-weight-bold text-success text-camelcase mb-1">Default Team</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">25 Players ( Blank )</div>

                                            </div>
                                            <div className="col-auto" style={{ paddingRight: '15px' }}>
                                                <div className="button-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <Link to="#" className="btn btn-primary shadow-sm d-block text-white" style={{ width: '100%' }}>
                                                        <i className="fas fa-hand-pointer fa-sm text-white-50"></i> Select
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> {/* End Internal Card */}

                        </div> {/* End Card Body */}
                    </div> {/* End Shadow Card */}
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

                                <div className="form-check mt-3 ml-2 custom-checkbox"> {/* Adjust margin-top as needed */}
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
                    <div className="card border-left shadow h-100 py-2">
                        <div className="card-body">
                            {/* <div className="row no-gutters align-items-center">
                                <div className="col mr-2"  style={{ paddingLeft: '15px' }}>
                                    <div className="h5 font-weight-bold text-primary text-camelcase mb-1">
                                        Start</div>
                                </div>
                                <div className="col-auto" style={{ paddingRight: '15px' }}>
                                    <i className="fas fa-play fa-2x text-gray-300"></i>
                                </div>
                            </div> */}
                            <div className="col-auto" style={{ paddingRight: '15px' }}>
                                <div className="button-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Link to="/game" className="btn btn-primary shadow-sm d-block text-white" style={{ width: '100%' }}>
                                        <i className="fas fa-sm text-white-50"></i> Start Game
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