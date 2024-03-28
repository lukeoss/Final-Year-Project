const apiBaseURL = 'http://localhost:8000/api/';

export const createMatchEvent = async (matchEvent) => {
    try {
      const response = await fetch(`${apiBaseURL}match-events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers like authorization tokens if required
        },
        body: JSON.stringify(matchEvent),
      });
      if (!response.ok) {
        // Log or alert the response body for more details on the error
        const errorBody = await response.json(); // Assuming JSON response
        console.error('Failed request details:', errorBody);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error creating match event:', error);
      throw error;
    }
  };
  

export const createMatch = async (home_team_id, away_team_id) => {
    try {
      const response = await fetch(`${apiBaseURL}matches/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization tokens if required, for example:
          // 'Authorization': 'Bearer <your_token_here>',
        },
        body: JSON.stringify({
          date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD format
          home_team: home_team_id,
          away_team: away_team_id,
          location: "Default Location",
          competition: "Regular Season",
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const match = await response.json();
      return match;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
};

export const deleteMatchEventDB = async (id) => {
    try {
      const response = await fetch(`${apiBaseURL}match-events/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const events = await response.json();
      return events;
    } catch (error) {
      console.error('Error getting match events:', error);
      throw error;
    }
};

  