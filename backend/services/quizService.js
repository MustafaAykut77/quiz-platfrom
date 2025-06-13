import QuizModel from "../models/quiz.js";

export const getQuestions = async (quizid) => {
    try {
        const existingQuiz = await QuizModel.findOne({ quizid });

        if (!existingQuiz) {
            return {
                success: false,
                error: "Quiz not found"
            };
        }
        return existingQuiz.questions;
    }
    catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};