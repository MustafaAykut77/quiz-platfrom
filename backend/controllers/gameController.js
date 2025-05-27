import GameModel from "../models/game.js";

export const getAllGames = async (req, res) => {
    try {
        const gameData = await GameModel.find();
        res.json({
            success: true,
            data: gameData
        });
    } catch (error) {
        console.error("Error fetching Gamezes:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching Gamezes" 
        });
    }
};

export const getGame = async (req, res) => {
    try {
        const { code } = req.params;

        const game = await GameModel.findOne({ code });
        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            });
        }

        res.json({
            success: true,
            data: Game
        });
    } catch (error) {
        console.error("Error fetching game by code:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching game"
        });
    }
};

export const createGame = async (req, res) => {
    try {
        const newGame = new GameModel(req.body);
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