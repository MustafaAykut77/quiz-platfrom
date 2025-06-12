import axios from 'axios';

// Game oluşturma fonksiyonu
const createGame = async (token, quizid) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/game/create`, { quizid }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating game:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create game');
  }
};

// Game alma fonksiyonu
const getGame = async (gameid) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/game/get/${gameid}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching game:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch game');
  }
};

export { createGame, getGame };