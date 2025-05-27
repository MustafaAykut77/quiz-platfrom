import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    quizid: {
        type: String,
        required: true
    },
    creatorid: {
        type: String,
        required: true
    }
}, { timestamps: true });

const GameModel = mongoose.model("Game", gameSchema);

export default GameModel;
