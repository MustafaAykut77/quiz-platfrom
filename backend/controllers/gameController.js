import GameModel from "../models/game.js";
import QuizModel from "../models/quiz.js";
import { generateRandomId } from "../utils/IdGenerator.js";
import { startGameSocket } from "../socket/socketHandlers.js";

export const getGameId = async (req, res) => {
    try {
        const { code } = req.params;
        
        const game = await GameModel.findOne(
            { code },
            {
                code: 1,
                creatorid: 1,
                quizid: 1,
                _id: 0
            }
        );
        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            });
        }
        
        res.json({
            success: true,
            data: game
        });
    } catch (error) {
        console.error("Error fetching game by code:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching game"
        });
    }
};

export const getGame = async (req, res) => {
    try {
        const game = await GameModel.findOne(
            { creatorid: req.user.uid },
            {
                code: 1,
                creatorid: 1,
                quizid: 1,
                players: 1,
                _id: 0
            }
        );
        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            });
        }
        
        res.json({
            success: true,
            data: game
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error fetching game" 
        });
    }
};

export const createGame = async (req, res) => {
    try {
        const newGame = new GameModel(req.body);

        newGame.creatorid = req.user.uid;

        do {
            newGame.code = generateRandomId(8);
        } while(await GameModel.findOne({ code: newGame.code }));

        const existingQuiz = await QuizModel.findOne({ quizid: newGame.quizid });
        if (!existingQuiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        const userQuiz = await GameModel.findOne({ creatorid: newGame.creatorid });
        if (userQuiz) {
            return res.status(409).json({
                success: false,
                message: "You already have an active game. Only one game per user is allowed."
            });
        }

        const savedGame = await newGame.save();

        res.json({
            success: true,
            data: savedGame
        });
    } catch (error) {
        console.error("Error creating Games:", error);
        res.status(500).json({ 
            success: false,
            message: "Error creating Games" 
        });
    }
};

export const startGame = async (req, res) => {
    try {        
        const game = await GameModel.findOne({ creatorid: req.user.uid });
        if (!game) {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }
        console.log("a");
        console.log(req.app.get('io'));
        startGameSocket(req.app.get('io'), game.code);
        console.log("b");

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};