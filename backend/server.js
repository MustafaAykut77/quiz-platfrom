import express from "express";
import mongoose from "mongoose";
import { Server } from 'socket.io';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;
const MONGOURL = process.env.MONGO_URL;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const UserModel = mongoose.model("users", userSchema);

mongoose.connect(MONGOURL)
.then(() => {
  console.log("Database is connected successfully.");

  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    }
  });

  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    socket.on("send-code", (code) => {
      console.log(code);
    });
  });

})
.catch((error) => console.log(error));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get("/getUsers", async (req, res) => {
  try {
    const userData = await UserModel.find();
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});
