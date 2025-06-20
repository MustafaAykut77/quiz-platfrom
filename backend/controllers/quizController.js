import QuizModel from "../models/quiz.js";
import { generateRandomId } from "../utils/IdGenerator.js";

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

export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await QuizModel.find(
            { creatorid: req.user.uid },
            {
                quizid: 1,
                quizName: 1,
                quizCategory: 1,
                createdAt: 1,
                questions: 1,
                _id: 0
            }
        );
        
        const quizzesWithCount = quizzes.map(quiz => ({
            quizid: quiz.quizid,
            quizName: quiz.quizName,
            quizCategory: quiz.quizCategory,
            createdAt: quiz.createdAt,
            questionCount: quiz.questions ? quiz.questions.length : 0
        }));
        
        res.json({
            success: true,
            data: quizzesWithCount
        });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching quizzes" 
        });
    }
};

export const createQuiz = async (req, res) => {
    try {
        const newQuiz = new QuizModel(req.body);
        newQuiz.creatorid = req.user.uid;
        do {
            newQuiz.quizid = generateRandomId(8);
        } while(await QuizModel.findOne({ quizid: newQuiz.quizid }));
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

export const updateQuiz = async (req, res) => {
    try {
        const { quizid } = req.params;
        
        const existingQuiz = await QuizModel.findOne({ 
            quizid: quizid, 
            creatorid: req.user.uid 
        });
        
        if (!existingQuiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz bulunamadı veya yetkiniz yok"
            });
        }
        
        const updatedQuiz = await QuizModel.findOneAndUpdate(
            { quizid: quizid, creatorid: req.user.uid },
            { 
                ...req.body,
                creatorid: req.user.uid,
                quizid: quizid
            },
            { 
                new: true,
            }
        );

        res.json({
            success: true,
            message: "Quiz başarıyla güncellendi",
            data: updatedQuiz
        });
    } catch (error) {
        console.error("Error updating quiz:", error);
        res.status(500).json({ 
            success: false,
            message: "Quiz güncellenirken hata oluştu" 
        });
    }
};

export const deleteQuiz = async (req, res) => {
    try {
        const { quizid } = req.params;
        
        const quiz = await QuizModel.findOne({ quizid });
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }
        
        if (quiz.creatorid !== req.user.uid) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this quiz"
            });
        }
        
        await QuizModel.deleteOne({ quizid });
        
        res.json({
            success: true,
            message: "Quiz deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({ 
            success: false,
            message: "Error deleting quiz"
        });
    }
};