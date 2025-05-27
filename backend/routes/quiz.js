import express from "express";
import { createQuiz, getAllQuizzes } from "../controllers/quizController.js";
import { authToken } from "../middleware/authToken.js";

const quizRoutes = express.Router();

quizRoutes.get("/all", getAllQuizzes);
quizRoutes.post("/create", createQuiz);

export default quizRoutes;