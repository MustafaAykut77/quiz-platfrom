import express from "express";
import { createUser, getUser, getAllUsers } from "../controllers/userController.js";
import { authToken } from "../middleware/authToken.js";

const userRoutes = express.Router();

userRoutes.get("/get/:uid", getUser);
userRoutes.post("/create", createUser);

userRoutes.get("/all", getAllUsers);

export default userRoutes;