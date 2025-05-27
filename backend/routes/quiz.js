import express from "express";
import { createQuiz, getAllQuizzes, getQuiz } from "../controllers/quizController.js";
import { authToken } from "../middleware/authToken.js";

const quizRoutes = express.Router();

quizRoutes.get("/get/:quizid", getQuiz);
quizRoutes.post("/create", createQuiz);

quizRoutes.get("/all", getAllQuizzes);

export default quizRoutes;