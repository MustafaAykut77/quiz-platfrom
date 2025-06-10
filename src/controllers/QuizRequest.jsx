import axios from 'axios';

// Quiz oluşturma fonksiyonu
const createQuiz = async (token, quizData) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/quiz/create`, quizData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create quiz');
  }
};

// Quiz alma fonksiyonu
const getQuiz = async (quizid) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/quiz/get/${quizid}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching quiz:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch quiz');
  }
};

// Tüm quizleri alma fonksiyonu
const getAllQuizzes = async (token) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/quiz/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch quizzes');
  }
};

// Quiz güncelleme fonksiyonu (yeni eklendi)
const updateQuiz = async (token, quizid, quizData) => {
  try {
    const response = await axios.put(`http://localhost:3000/api/quiz/update/${quizid}`, quizData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error updating quiz:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update quiz');
  }
};

// Quiz silme fonksiyonu (yeni eklendi)
const deleteQuiz = async (token, quizid) => {
  try {
    const response = await axios.delete(`http://localhost:3000/api/quiz/delete/${quizid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting quiz:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete quiz');
  }
};

export { createQuiz, getQuiz, getAllQuizzes, updateQuiz, deleteQuiz };