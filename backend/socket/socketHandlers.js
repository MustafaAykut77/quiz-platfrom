import { getPlayers, addPlayer, updatePlayer, getGameId } from "../services/gameService.js";
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

export const startGameSocket = (io, code) => {
    socket.off('join_game');
    io.to(code).emit('start_game');

    const game = getGameId(code);
    const questions = getQuestions(game.quizid);
    let questionCount = 0;

    io.to(code).emit('question', {
        question: questions[questionCount],
        questionCount: questionCount + 1,
        totalQuestions: questions.length
    });

};