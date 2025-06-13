import { getPlayers, addPlayer, updatePlayer, getGame } from "../services/gameService.js";
import { getQuestions } from "../services/quizService.js";

export const setupConnectionSocket = (io) => {
	io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join_game", async (code, username) => {
            const result = await addPlayer(code, username);
            if (!result.success) {
                console.error(`Error adding player: ${result.error}`);
                io.to(socket.id).emit('join_return', { error: result.error });
                return;
            }
            
            socket.join(code);
            socket.room = code;
            socket.username = username;

            const players = await getPlayers(code);

            console.log(`User ${socket.id} | ${username} joined game ${code}`);

            socket.emit('join_return',
                {
                    success: true,
                    code,
                    username,
                    players
                }
            );
            io.to(code).emit('user_entered', {
                playerName: username,
                playerScore: 0
            });
        });
    });
};

export const startGameSocket = async (io, code) => {
    io.to(code).allSockets().then(sockets => {
        sockets.forEach(socketId => {
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.removeAllListeners('join_game');
            }
        });
    });
    io.to(code).emit('start_game');
    
    const game = await getGame(code);
    const questions = await getQuestions(game.data.quizid);
    let questionCount = 0;
    
    for (const question of questions) {
        questionCount++;
        
        const endAnswer = Date.now() + 30000;
        const endQuestion = Date.now() + 35000;
        
        const data = {
            question: question.question,
            img: question.img || null,
            answers: question.answers.map(answer => ({
                answer: answer.answer,
                img: answer.img || null
            })),
            questionCount: questionCount,
            totalQuestions: questions.length,
            endAnswer
        };
        
        let correctAnswer = null;
        question.answers.forEach(answer => {
            if (answer.isCorrect) {
                correctAnswer = answer.answer;
            }
        });
        
        io.to(code).emit('question', data);

        io.to(code).allSockets().then(sockets => {
            sockets.forEach(socketId => {
                const socket = io.sockets.sockets.get(socketId);
                if (socket) {
                    socket.on('answer', async (playerName, answer) => {
                        if (Date.now() < endAnswer) {
                            if (answer === correctAnswer) {
                                await updatePlayer(code, playerName, 50);
                            }
                        }
                        else {
                            socket.off('answer');
                            return;
                        }

                        while (Date.now() < endAnswer) {
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }

                        const players = await getPlayers(code);
                        socket.emit('answer_return', { success: answer === correctAnswer, players });

                        socket.off('answer');
                    });
                }
            });
        });

        while (Date.now() < endQuestion) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
};