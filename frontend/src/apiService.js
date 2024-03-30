const apiBaseURL = 'http://localhost:8000/api/';

export const createMatchEvent = async (matchEvent) => {
  try {
    const response = await fetch(`${apiBaseURL}match-events/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchEvent),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Failed request details:', errorBody);
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const eventData = await response.json();
    return eventData;
  } catch (error) {
    console.error('Error creating match event:', error);
    throw error;
  }
};

export const createMatch = async (home_team_id, away_team_id) => {
  try {
    const response = await fetch(`${apiBaseURL}matches/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: new Date().toISOString(),
        home_team: home_team_id,
        away_team: away_team_id,
        location: "Default Location",
        competition: "Regular Season",
      }),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

export const deleteMatchEventDB = async (id) => {
  try {
    const response = await fetch(`${apiBaseURL}match-events/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Network response was not ok');
    console.log('Event deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting match event:', error);
    throw error;
  }
};

export const getMatchEvents = async (matchId) => {
  try {
    const response = await fetch(`${apiBaseURL}match-events/${matchId}/`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error getting match events:', error);
    throw error;
  }
};
