import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";
import app from "./routes/app.js";
import { setupSocketHandlers } from "./socket/socketHandlers.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL;

// MongoDB server bağlantısının kurulması
mongoose.connect(MONGOURL).then(() => {
  console.log("Database is connected successfully.");
}).catch((error) => console.log(error));

// Express.JS serverinin açılması
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Socket.io serverinin açılması
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }
});

// Socekt'ların kurulması
setupSocketHandlers(io);

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
