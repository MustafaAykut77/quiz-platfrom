import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    quizid: {
        type: String,
        required: true,
        unique: true
    },
    creatorid: {
        type: String,
        required: true
    },
    quizName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    quizCategory: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    questions: [{
        question: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 1024
        },
        img: {
            type: String
        },
        answers: [{
            answer: {
                type: String,
                required: true,
                trim: true,
                minlength: 1,
                maxlength: 1024
            },
            img: {
                type: String
            },
            isCorrect: {
                type: Boolean,
                default: false
            }
        }]
    }]
}, { timestamps: true });

const QuizModel = mongoose.model("Quiz", quizSchema);

export default QuizModel;
