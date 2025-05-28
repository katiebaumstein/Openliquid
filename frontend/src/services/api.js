import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const fetchLeaderboardData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leaderboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    throw error;
  }
};

export const fetchExchangeData = async (exchange) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leaderboard/${exchange}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${exchange} data:`, error);
    throw error;
  }
};