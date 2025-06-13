import QuizModel from "../models/quiz.js";

export const getQuestions = async (quizid) => {
    try {
        console.log("Fetching questions for quiz code:", quizid);
        const existingQuiz = await QuizModel.findOne({ quizid });
        console.log("Existing Quiz:", existingQuiz);
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