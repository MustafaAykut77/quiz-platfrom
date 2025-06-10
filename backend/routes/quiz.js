import express from "express";
import { getQuiz, getAllQuizzes, createQuiz, deleteQuiz } from "../controllers/quizController.js";
import { authToken } from "../middleware/authToken.js";

const quizRoutes = express.Router();

quizRoutes.get("/get/:quizid", authToken, getQuiz);
quizRoutes.get("/all", authToken, getAllQuizzes);
quizRoutes.post("/create", authToken, createQuiz);
quizRoutes.post("/delete", authToken, deleteQuiz);

export default quizRoutes;