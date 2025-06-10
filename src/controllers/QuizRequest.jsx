import axios from 'axios';

// Quiz oluşturma fonksiyonu
const createQuiz = async (quizData) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/quiz/create`, quizData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create quiz');
  }
};

// Quiz alma fonksiyonu (düzeltilmiş)
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
const getAllQuizzes = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/quiz/getall`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch quizzes');
  }
};

export { createQuiz, getQuiz, getAllQuizzes };