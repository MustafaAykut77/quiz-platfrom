import express from "express";
import mongoose from "mongoose";
import { Server } from 'socket.io';
import { authToken } from "./authToken.js";
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
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
})
.catch((error) => console.log(error));

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
  
  // Hata durumlarını ele al
  socket.on("error", (error) => {
    console.error(`Socket ${socket.id} error:`, error);
  });
  
  // Bağlantı koptuğunda temizlik yap
  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} disconnected. Reason: ${reason}`);
  });
  
  // Kod alma olayını dinle
  socket.on("send-code", (code) => {
    console.log(`Received code from ${socket.id}:`, code);
    // Yanıt gönder (aynı socket'e)
    socket.emit("receive-code", code);
    // veya tüm istemcilere yanıt göndermek için:
    // io.emit("receive-code", code);
  });
});

// Düzgün kapanış için olay dinleyicisi ekle
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  io.close();
  server.close(() => {
    console.log('Server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

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

app.get('/protected', authToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});
