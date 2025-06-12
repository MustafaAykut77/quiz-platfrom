import QuizModel from "../models/quiz.js";

export const getQuestions = async (code) => {
    try {
        const existingQuiz = await QuizModel.findOne({ code });
        if (!existingQuiz) {
            return {
                success: false,
                error: "Quiz not found"
            };
        }
        return {
            success: true,
            data: existingQuiz.questions
        };
    }
    catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};