import express from "express";
import { getQuiz, getAllQuizzes, createQuiz, updateQuiz, deleteQuiz } from "../controllers/quizController.js";
import { authToken } from "../middleware/authToken.js";

const quizRoutes = express.Router();

quizRoutes.get("/get/:quizid", getQuiz);
quizRoutes.get("/all", authToken, getAllQuizzes);

quizRoutes.post("/create", authToken, createQuiz);
quizRoutes.put("/update/:quizid", authToken, updateQuiz);

quizRoutes.delete("/delete/:quizid", authToken, deleteQuiz);

export default quizRoutes;