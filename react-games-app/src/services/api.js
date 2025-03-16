import axios from 'axios';

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export const fetchGames = async (params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: { key: API_KEY, ...params },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

export const fetchGameDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/games/${id}`, {
      params: { key: API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
};