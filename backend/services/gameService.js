import GameModel from "../models/game.js";
import { generateRandomId } from "../utils/IdGenerator.js";

export const addPlayer = async (code, name) => {
    try {
        const existingGame = await GameModel.findOne({ code });
        
        if (!existingGame) {
            return {
                success: false,
                error: "Game not found"
            };
        }

        if (existingGame.players.some(player => player.playerName === name)) {
            return {
                success: false,
                error: "Player name already exists"
            };
        }
        
        existingGame.players.push({
            playerName: name,
            playerScore: 0
        });

        const updatedGame = await GameModel.findOneAndUpdate(
            { code },
            { players: existingGame.players },
            { new: true }
        );

        return {
            success: true,
            data: updatedGame
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

export const updatePlayer = async (code, name, score) => {
    try {
        const existingGame = await GameModel.findOne({ code });
        
        if (!existingGame) {
            return {
                success: false,
                error: "Game not found"
            };
        }
        
        existingGame.players.forEach(player => {
            if (player.playerName === name) {
                player.playerScore = score;
            }
        });

        const updatedGame = await GameModel.findOneAndUpdate(
            { code },
            { players: existingGame.players },
            { new: true }
        );

        return {
            success: true,
            data: updatedGame
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};