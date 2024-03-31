import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import PitchCanvas from '../components/PlotPitch/PitchCanvas.js';
import './Additional.css';
import './Account.css';

const Account = () => {
  const [eventFilter, setEventFilter] = useState('');
  const [dashboardData, setDashboardData] = useState({
    all_time: {
      goals: 0,
      points: 0,
      misses: 0,
      total_shots: 0,
      gamesRecorded: 0,
      successfulShotsPercentage: 0,
      blocks: 0,
    },
    filtered: {
      goals: 0,
      points: 0,
      misses: 0,
      total_shots: 0,
      gamesRecorded: 0,
      successfulShotsPercentage: 0,
      blocks: 0,
    },
  });

  const fetchData = async (numberoflatestgames = '') => {
    const endpoint = numberoflatestgames ? `dashboard-data/${numberoflatestgames}/` : 'dashboard-data/';
    try {
      const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();

      setDashboardData(prevState => ({
        ...prevState,
        filtered: data.filtered,
        all_time: data.all_time || prevState.all_time,
      }));
      console.log(data.filtered)
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectProgress = (e, numberOfGames) => {
    e.preventDefault();
    fetchData(numberOfGames);
  };

  const handleSelectPlot = (e, filterType) => {
    e.preventDefault();
    setEventFilter(filterType);
  };

  const calculatePercentage = (value, total) => {
    if (total > 0) {
      return `${Math.round((value / total) * 100)}%`;
    }
    return '0%';
  };
  
  return (
    
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4" style={{ paddingTop: '15px' }}>
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
        <Link to="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
          className="fas fa-download fa-sm text-white-50"></i> Download Statistics </Link>
      </div>

      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2" style={{ paddingLeft: '15px' }}>
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Games Recorded</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.all_time.games_recorded}</div>
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
                <div className="col mr-2" style={{ paddingLeft: '15px' }}>
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Shots Taken</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.all_time.total_shots}</div>
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
                <div className="col mr-2" style={{ paddingLeft: '15px' }}>
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Latest Games Successful Shots</div>
                  <div className="d-flex align-items-center">
                    <div className="mr-3">
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{Math.round(dashboardData.all_time.successful_shots_percentage)}%</div>
                    </div>
                    <div className="progress-container" style={{ flex: 0.7, display: 'flex', justifyContent: 'center' }}>
                      <div className="progress progress-sm w-100" style={{ maxWidth: '100%' }}>
                        <div className="progress-bar bg-info" role="progressbar" style={{ width: `${dashboardData.all_time.successful_shots_percentage}%` }} aria-valuenow={dashboardData.all_time.successful_shots_percentage} aria-valuemin="0"
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
                <div className="col mr-2" style={{ paddingLeft: '15px' }}>
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Blocks</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.all_time.blocks}</div>
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
            <h6 className="m-0 font-weight-bold text-primary">
              All Time Shot Distribution <span className="info-icon">
                <i className="fa-solid fa-circle-info fa-sm "></i>
                <span className="info-text">These plots represent the shot distribution across all recorded games, 
                for more detailed and specific plots see the individual games section.</span>
              </span>
            </h6>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic" className="btn btn-sm shadow-sm">
                  <i className="fas fa-ellipsis-v fa-sm text-white-50"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'goal')}>Goals</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'point')}>Points</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'miss')}>Missed</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={(e) => handleSelectPlot(e, '')}>Everything</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="card-body">
              {/* <div className="chart-area"> */}
                <PitchCanvas filter={eventFilter}  filteredEvents={dashboardData.filtered} />
                {/* <canvas id="myAreaChart"></canvas> */}
              {/* </div> */}
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary"> Shot Outcomes </h6>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic" className="btn btn-sm shadow-sm">
                  <i className="fas fa-ellipsis-v fa-sm text-white-50"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={(e) => handleSelectProgress(e, '1')}>Previous Game</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => handleSelectProgress(e, '5')}>Previous 5 Games</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => handleSelectProgress(e, '10')}>Previous 10 Games</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={(e) => handleSelectProgress(e, '')}>All Time</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="card-body">
                <h4 className="small font-weight-bold">Goal<span className="float-right">
                    {calculatePercentage(dashboardData.filtered.goals, dashboardData.filtered.total_shots)}</span></h4>
                <div className="progress mb-4">
                    <div className="progress-bar bg-success" role="progressbar" 
                    style={{ width: calculatePercentage(dashboardData.filtered.goals, dashboardData.filtered.total_shots) }}
                    aria-valuenow={calculatePercentage(dashboardData.filtered.goals, dashboardData.filtered.total_shots)}
                    aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <h4 className="small font-weight-bold">Point<span className="float-right">
                    {calculatePercentage(dashboardData.filtered.points, dashboardData.filtered.total_shots)}</span></h4>
                <div className="progress mb-4">
                    <div className="progress-bar bg-warning" role="progressbar" 
                    style={{ width: calculatePercentage(dashboardData.filtered.points, dashboardData.filtered.total_shots) }}
                    aria-valuenow={calculatePercentage(dashboardData.filtered.points, dashboardData.filtered.total_shots)}
                    aria-valuemin="0" aria-valuemax="100"></div>
                </div>

                <h4 className="small font-weight-bold">Miss<span className="float-right">
                    {calculatePercentage(dashboardData.filtered.misses, dashboardData.filtered.total_shots)}</span></h4>
                <div className="progress mb-4">
                    <div className="progress-bar bg-danger" role="progressbar" 
                    style={{ width: calculatePercentage(dashboardData.filtered.misses, dashboardData.filtered.total_shots) }}
                    aria-valuenow={calculatePercentage(dashboardData.filtered.misses, dashboardData.filtered.total_shots)}
                    aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;