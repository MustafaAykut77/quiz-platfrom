import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    creatorid: {
        type: String,
        required: true
    },
    quizid: {
        type: String,
        required: true
    },
    players: [{
        playerName: {
            type: String,
            required: true
        },
        playerScore: {
            type: Number,
            required: true,
            default: 0
        }
    }]
}, { timestamps: true });

const GameModel = mongoose.model("Game", gameSchema);

export default GameModel;
