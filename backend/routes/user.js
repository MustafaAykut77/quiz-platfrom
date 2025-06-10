import express from "express";
import { createUser, getUser } from "../controllers/userController.js";
import { authToken } from "../middleware/authToken.js";

const userRoutes = express.Router();

userRoutes.get("/get", authToken, getUser);
userRoutes.post("/create", authToken, createUser);

export default userRoutes;