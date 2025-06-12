import GameModel from "../models/game.js";

export const getGame = async (code) => {
    try {
        const game = await GameModel.findOne(
            { code },
            {
                code: 1,
                creatorid: 1,
                quizid: 1,
                players: 1,
                _id: 0
            }
        );
        if (!game) {
            return {
                success: false,
                error: "Game not found"
            };
        }
        return {
            success: true,
            data: game
        };
    }
    catch (error) {
        console.error("Error fetching game by code:", error);
        return {
            success: false,
            error: "Error fetching game"
        };
    }
};

export const getPlayers = async (code) => {
    try {
        const existingGame = await GameModel.findOne({ code });
        if (!existingGame) {
            return {
                success: false,
                error: "Game not found"
            };
        }

        const players = existingGame.players.map(player => ({
            playerName: player.playerName,
            playerScore: player.playerScore
        }));

        return {
            success: true,
            data: players
        };
    }
    catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

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