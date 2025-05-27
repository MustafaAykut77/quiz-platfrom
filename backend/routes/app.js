import express from "express";
import cors from "cors";
import userRoutes from "./users.js";

const app = express();

// Express ayarların yapıyoruz
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', userRoutes);

export default app;