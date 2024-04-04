// apiService.js

import axios from 'axios';

const apiBaseURL = 'https://localhost:8000/api/';

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
        await API.post('token/refresh/');
        return API(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

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

export const getMatchEvents = async (matchId) => {
  try {
    const response = await API.get(`match-events/${matchId}/`);
    return response.data;
  } catch (error) {
    console.error('Error getting match events:', error);
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