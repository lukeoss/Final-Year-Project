// apiService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const API = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});

API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await fetch(`${apiBaseURL}token/refresh/`, {
          method: 'POST',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          Cookies.set('access', data.access);
          API.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export const checkEmailExists = async (email) => {
  try {
    const response = await API.post('check-email-exists/', { email });
    return response.data.exists;
  } catch (error) {
    console.error('Error checking email:', error);
    throw error;
  }
};

export const createAccount = async (firstName, lastName, email, password) => {
  try {
    const response = await API.post('create-account/', {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

export const createMatchEvent = async (matchEvent) => {
  try {
    const response = await API.post('match-events/', matchEvent);
    return response.data;
  } catch (error) {
    console.error('Error creating match event:', error);
    throw error;
  }
};

export const createMatch = async (home_team_id, away_team_id, location, competition) => {
  try {
    const outdata = {
      date: new Date().toISOString(),
      home_team: home_team_id,
      away_team: away_team_id,
      location: location,
      competition: competition
    };
    
    const response = await API.post('matches/', outdata, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

export const deleteMatchEventDB = async (id) => {
  try {
    await API.delete(`match-events/${id}/`);
    console.log('Event deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting match event:', error);
    throw error;
  }
};

// export const getMatchEvents = async (matchId) => {
//   try {
//     const response = await API.get(`match-events/${matchId}/`);
//     return response.data;
//   } catch (error) {
//     console.error('Error getting match events:', error);
//     throw error;
//   }
// };

export const getMatchEvents = async (matchId = '', detail = false) => {
  const detailQuery = detail ? '?detail=true' : '';
  const endpoint = matchId ? `match-events/${matchId}/${detailQuery}` : `match-events/${detailQuery}`;
  try {
    const response = await API.get(endpoint, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error getting match events${matchId ? ' for match ' + matchId : ''}:`, error);
    throw error;
  }
};


export const login = async (email, password) => {
  try {
    const response = await API.post('token/', {
      username: email,
      password: password,
    }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

export const fetchDashboardData = async (numberoflatestgames = '') => {
  const endpoint = numberoflatestgames ? `dashboard-data/${numberoflatestgames}/` : 'dashboard-data/';
  try {
    const response = await API.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An unknown error occurred');
  }
};

// This fetches all events and is for the dashboard
export const fetchMatchEvents = async () => {
  try {
    const response = await API.get('match-events/', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An unknown error occurred');
  }
};

export const fetchTeams = async () => {
  try {
    const response = await API.get('teams/');
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const fetchPastGames = async () => {
  try {
    const response = await API.get('past-games/');
    return response.data;
  } catch (error) {
    console.error('Error fetching past games:', error);
    throw error;
  }
};

export const fetchMatchDetails = async (matchId) => {
  try {
    const response = await API.get(`matches/${matchId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw error;
  }
};

export const fetchUserName = async () => {
  try {
    const response = await API.get(`user-name/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users name:', error);
    throw error;
  }
};

export const fetchPlayer = async (playerId) => {
  try {
    const response = await API.get(`player/${playerId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching player details:', error);
    throw error;
  }
};