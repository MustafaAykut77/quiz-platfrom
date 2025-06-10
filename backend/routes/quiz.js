import express from "express";
import { createQuiz, getAllQuizzes, getQuiz } from "../controllers/quizController.js";
import { authToken } from "../middleware/authToken.js";

const quizRoutes = express.Router();

quizRoutes.get("/get/:quizid", authToken, getQuiz);
quizRoutes.get("/all", authToken, getAllQuizzes);
quizRoutes.post("/create", authToken, createQuiz);


export default quizRoutes;