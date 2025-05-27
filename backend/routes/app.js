import express from "express";
import cors from "cors";
import userRoutes from "./user.js";
import quizRoutes from "./quiz.js";

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

app.use('/api/user', userRoutes);
app.use('/api/quiz', quizRoutes);

export default app;