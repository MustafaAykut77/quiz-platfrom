import express from "express";
import { getGameId, getGame, createGame, startGame } from "../controllers/gameController.js";
import { authToken } from "../middleware/authToken.js";

const gameRoutes = express.Router();

gameRoutes.get("/get/:code", getGameId);
gameRoutes.get("/get", authToken, getGame);
gameRoutes.post("/start", authToken, startGame);
gameRoutes.post("/create", authToken, createGame);

export default gameRoutes;