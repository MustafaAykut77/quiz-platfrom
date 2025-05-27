import express from "express";
import { getUsers } from "../controllers/userController.js";
import { authToken } from "../middleware/authToken.js";

const userRoutes = express.Router();

userRoutes.get("/", getUsers);

export default userRoutes;