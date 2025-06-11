import express from "express";
import { getGame, createGame } from "../controllers/gameController.js";
import { authToken } from "../middleware/authToken.js";

const gameRoutes = express.Router();

gameRoutes.get("/get/:code", getGame);
gameRoutes.post("/create", authToken, createGame);

export default gameRoutes;