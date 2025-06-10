import axios from 'axios';

const getUser = async (token) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/user/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response;
  } catch (error) {
    console.error('Error fetching user:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

const createUser = async (token, username, img) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/user/create`, 
      {
        username: username,
        img: img
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response;
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

export { getUser, createUser };

