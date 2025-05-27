import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";
import { authToken } from "../middleware/authToken.js";

const userRoutes = express.Router();

userRoutes.get("/get", getUsers);
userRoutes.post("/create", createUser);

export default userRoutes;