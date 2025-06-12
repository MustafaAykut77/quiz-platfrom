import { addPlayer, updatePlayer } from "../services/gameService.js";
import { authToken } from "../middleware/authToken.js";

export const setupSocketHandlers = (io) => {
	io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join_game", (code, username) => {
            const result = addPlayer(code, username);
            if (!result.success) {
                console.error(`Error adding player: ${result.error}`);
                io.to(socket.id).emit('join_return', { error: result.error });
                return;
            }

            socket.join(code);
            socket.room = code;
            socket.username = username;

            console.log(`User ${socket.id} | ${username} joined game ${code}`);

            io.to(code).emit('join_return', { success: true, code, username });
        });        
    });

    io.of("/admin").use(authToken).on("connection", (socket) => {
        console.log("An admin connected:", socket.user);
    });
};