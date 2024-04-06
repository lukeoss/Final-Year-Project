import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import PitchCanvas from '../components/PlotPitch/PitchCanvas.js';
import { fetchDashboardData, fetchUserName, fetchMatchEvents } from '../apiService.js';
import './Additional.css';
import './Account.css';

const Account = () => {
  const [currentPlotFilter, setPlotCurrentFilter] = useState('Everything ');
  const [currentPrgFilter, setPrgCurrentFilter] = useState('All Time ');
  const [eventFilter, setEventFilter] = useState('');
  const [userName, setUserName] =useState('');
  const [matchEvents, setMatchEvents] = useState([]);
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
    try {
      const useName = await fetchUserName();
      const allEventData = await fetchMatchEvents();
      const data = await fetchDashboardData(numberoflatestgames);
      setUserName(useName);
      setMatchEvents(allEventData);
      setDashboardData(prevState => ({
        ...prevState,
        filtered: data.filtered,
        all_time: data.all_time || prevState.all_time,
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectProgress = (e, numberOfGames, filterLabel) => {
    e.preventDefault();
    fetchData(numberOfGames);
    setPrgCurrentFilter(filterLabel);
  };

  const handleSelectPlot = (e, filterType, filterLabel) => {
    e.preventDefault();
    setEventFilter(filterType);
    setPlotCurrentFilter(filterLabel);
  };

  const filteredEvents = eventFilter
  ? matchEvents.filter(event => event.event_type.toLowerCase() === eventFilter.toLowerCase())
  : matchEvents;


  const calculatePercentage = (value, total) => {
    if (total > 0) {
      return `${Math.round((value / total) * 100)}%`;
    }
    return '0%';
  };
  
  return (
    
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4" style={{ paddingTop: '15px' }}>
        <h1 className="h3 mb-0 text-gray-800">Dashboard - {userName.first_name} {userName.last_name}</h1>
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
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Successful Shots</div>
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
              All Time Event Distribution <span className="info-icon">
                <i className="fa-solid fa-circle-info fa-sm "></i>
                <span className="info-text">Data across all games, translated to shooting in the one direction (Left)</span>
              </span>
            </h6>
            <div className='row'>
              <div className="col">
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic" className="btn btn-sm shadow-sm">
                    Team
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item>Team 1</Dropdown.Item>
                    <Dropdown.Item>Team 2</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Default</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="col">
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic" className="btn btn-sm shadow-sm">
                    Match
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item>23rd March</Dropdown.Item>
                    <Dropdown.Item>4th April</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Latest</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="col">
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic" className="btn btn-sm shadow-sm">
                    {currentPlotFilter}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'goal', 'Goals  ')}>Goals</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'point', 'Points  ')}>Points</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'miss', 'Missed  ')}>Missed</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'block', 'Blocks  ')}>Blocks</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => handleSelectPlot(e, 'foul', 'Fouls  ')}>Foul</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={(e) => handleSelectPlot(e, '', 'Everything  ')}>Everything</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

              </div>

            <div className="card-body">
              {/* <div className="chart-area"> */}
                <PitchCanvas events={filteredEvents} />
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
                  {currentPrgFilter}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={(e) => handleSelectProgress(e, '1', 'Previous Game', 'Previous Game  ')}>Previous Game</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => handleSelectProgress(e, '5', 'Previous 5 Games', 'Previous 5 Games  ')}>Previous 5 Games</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => handleSelectProgress(e, '10', 'Previous 10 Games', 'Previous 10 Games  ')}>Previous 10 Games</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={(e) => handleSelectProgress(e, '', 'All Time  ')}>All Time</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="card-body">
                <h4 className="small font-weight-bold">Goals ({dashboardData.filtered.goals})<span className="float-right">
                    {calculatePercentage(dashboardData.filtered.goals, dashboardData.filtered.total_shots)}</span></h4>
                <div className="progress mb-4">
                    <div className="progress-bar bg-success" role="progressbar" 
                    style={{ width: calculatePercentage(dashboardData.filtered.goals, dashboardData.filtered.total_shots) }}
                    aria-valuenow={calculatePercentage(dashboardData.filtered.goals, dashboardData.filtered.total_shots)}
                    aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <h4 className="small font-weight-bold">Points ({dashboardData.filtered.points})<span className="float-right">
                    {calculatePercentage(dashboardData.filtered.points, dashboardData.filtered.total_shots)}</span></h4>
                <div className="progress mb-4">
                    <div className="progress-bar bg-warning" role="progressbar" 
                    style={{ width: calculatePercentage(dashboardData.filtered.points, dashboardData.filtered.total_shots) }}
                    aria-valuenow={calculatePercentage(dashboardData.filtered.points, dashboardData.filtered.total_shots)}
                    aria-valuemin="0" aria-valuemax="100"></div>
                </div>

                <h4 className="small font-weight-bold">Misses ({dashboardData.filtered.misses})<span className="float-right">
                    {calculatePercentage(dashboardData.filtered.misses, dashboardData.filtered.total_shots)}</span></h4>
                <div className="progress mb-4">
                    <div className="progress-bar bg-danger" role="progressbar" 
                    style={{ width: calculatePercentage(dashboardData.filtered.misses, dashboardData.filtered.total_shots) }}
                    aria-valuenow={calculatePercentage(dashboardData.filtered.misses, dashboardData.filtered.total_shots)}
                    aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6">
              <div className="card border-left shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-s font-weight-bold text-primary text-camelcase mb-1" style={{paddingLeft: '15px'}}>My Games</div>
                    </div>
                    <div className="button-group w-100 h-100" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
                    <Link to="/pastgames" className="btn btn-primary btn-icon-split">
                        <span className="text">View My Games</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="card border-left shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-s font-weight-bold text-primary text-camelcase mb-1" style={{paddingLeft: '15px'}}>My Teams</div>
                    </div>
                    <div className="button-group w-100 h-100" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
                    <Link to="/teams" className="btn btn-primary btn-icon-split">
                        <span className="text">View My Teams</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}

export default Account;