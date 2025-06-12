import { getPlayers, addPlayer, updatePlayer } from "../services/gameService.js";
import { authToken } from "../middleware/authToken.js";

export const setupSocketHandlers = (io) => {
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

    io.of("/admin").use(authToken).on("connection", (socket) => {
        console.log("An admin connected:", socket.user);
    });
};