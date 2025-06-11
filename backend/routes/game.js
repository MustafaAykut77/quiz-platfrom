import express from "express";
import { createGame, getAllGames, getGame } from "../controllers/gameController.js";
import { authToken } from "../middleware/authToken.js";

const gameRoutes = express.Router();

gameRoutes.get("/get/:code", getGame);
gameRoutes.post("/create", authToken, createGame);
gameRoutes.get("/all", authToken, getAllGames);

export default gameRoutes;