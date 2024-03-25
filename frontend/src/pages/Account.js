import React, { useState, useEffect } from 'react';
// import { Route, Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { Dropdown } from 'react-bootstrap';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Account.css";

const Account = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const response = await fetch('/api/user-info', {
                credentials: 'include', // Ensure cookies are included with the request
            });
            if (!response.ok) throw new Error('Not authenticated');
            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user info:', error);
            // Ideally, redirect to login page or show an error message
        }
    };

    fetchUserInfo();
  }, []);

  if (userInfo) {
      return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid">

        <div className="d-sm-flex align-items-center justify-content-between mb-4" style={{ paddingTop: '15px' }}>
                        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                        <Link href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                className="fas fa-download fa-sm text-white-50"></i> Download Statistics </Link>
                    </div>

        <div className="row">


            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2"  style={{ paddingLeft: '15px' }}>
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Games Recorded</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">13</div>
                            </div>
                            <div className="col-auto" style={{ paddingRight: '15px' }}>
                                <i className="fas fa-floppy-disk fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2"  style={{ paddingLeft: '15px' }}>
                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Total Shots Taken</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">167</div>
                            </div>
                            <div className="col-auto" style={{ paddingRight: '15px' }}>
                                <i className="fas fa-bullseye fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center justify-content-between">
                            <div className="col mr-2"  style={{ paddingLeft: '15px' }}>
                                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Latest Games Successful Shots</div>
                                <div className="d-flex align-items-center">
                                    <div className="mr-3">
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">64%</div>
                                    </div>
                                    <div className="progress-container" style={{ flex: 0.7, display: 'flex', justifyContent: 'center' }}>
                                        <div className="progress progress-sm w-100" style={{ maxWidth: '100%' }}>
                                            <div className="progress-bar bg-info" role="progressbar"
                                                style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0"
                                                aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-auto" style={{ paddingRight: '15px' }}>
                                <i className="fas fa-percent fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2"  style={{ paddingLeft: '15px' }}>
                                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                    Blocks</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">18</div>
                            </div>
                            <div className="col-auto" style={{ paddingRight: '15px' }}>
                                <i className="fas fa-hand fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div className="row">

            <div className="col-xl-8 col-lg-7">
                <div className="card shadow mb-4">

                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">Shot Distibution</h6>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className="btn btn-sm shadow-sm">
                                <i className="fas fa-ellipsis-v fa-sm text-white-50"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-2">Goals</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Points</Dropdown.Item>
                                <Dropdown.Item href="#/action-4">Missed</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#/action-5">Everything</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="card-body">
                        <div className="chart-area">
                            <canvas id="myAreaChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-4 col-lg-5">
                            <div className="card shadow mb-4">

                                <div
                                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary"> Shot Outcomes </h6>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic" className="btn btn-sm shadow-sm">
                                            <i className="fas fa-ellipsis-v fa-sm text-white-50"></i>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">Previous Game</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">Previous 5 Games</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Previous 10 Games</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item href="#/action-4">All Time</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                <div className="card-body">
                                <h4 class="small font-weight-bold">Goal<span
                                            class="float-right">13%</span></h4>
                                    <div class="progress mb-4">
                                        <div class="progress-bar bg-danger" role="progressbar" style={{width: '13%'}}
                                            aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <h4 class="small font-weight-bold">Point<span
                                            class="float-right">51%</span></h4>
                                    <div class="progress mb-4">
                                        <div class="progress-bar bg-warning" role="progressbar" style={{width: '51%'}}
                                            aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <h4 class="small font-weight-bold">Miss<span
                                            class="float-right">36%</span></h4>
                                    <div class="progress mb-4">
                                        <div class="progress-bar" role="progressbar" style={{width: '36%'}}
                                            aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

            {/* Ensure all other elements follow the same pattern of using className */}
            {/* Your content continues here... */}
        </div>
    </div>
  );
}

export default Account;
