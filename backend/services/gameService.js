import GameModel from "../models/game.js";
import { generateRandomId } from "../utils/IdGenerator.js";

export const addPlayer = async (code, name) => {
    try {
        const existingQuiz = await GameModel.findOne({ code });
        
        if (!existingQuiz) return;
        
        existingQuiz.players.push({
            playerid: generateRandomId(10),
            name: name,
            score: 0
        });

        const updatedQuiz = await GameModel.findOneAndUpdate(
            { code },
            { players: existingQuiz.players },
            { new: true }
        );

        return updatedQuiz;
    } catch (error) {
        return null;
    }
};

export const updatePlayer = async (code, name, score) => {
    try {
        const existingQuiz = await GameModel.findOne({ code });
        
        if (!existingQuiz) return;
        
        existingQuiz.players.array.forEach(player => {
            if (player.name === name) {
                player.score = score;
            }
        });

        const updatedQuiz = await GameModel.findOneAndUpdate(
            { code },
            { players: existingQuiz.players },
            { new: true }
        );

        return updatedQuiz;
    } catch (error) {
        return null;
    }
};