import QuizModel from "../models/quiz.js";

export const getAllQuizzes = async (req, res) => {
    try {
        const quizData = await QuizModel.find();
        res.json({
            success: true,
            data: quizData
        });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching quizzes" 
        });
    }
};

export const getQuiz = async (req, res) => {
    try {
        const { quizid } = req.params;

        const quiz = await QuizModel.findOne({ quizid });
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        res.json({
            success: true,
            data: quiz
        });
    } catch (error) {
        console.error("Error fetching quiz by quizid:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching quiz"
        });
    }
};

export const createQuiz = async (req, res) => {
    try {
        const newQuiz = new QuizModel(req.body);
        const savedQuiz = await newQuiz.save();

        res.json({
            success: true,
            data: savedQuiz
        });
    } catch (error) {
        console.error("Error creating quizzes:", error);
        res.status(500).json({ 
            success: false,
            message: "Error creating quizzes" 
        });
    }
};