

export const setupSocketHandlers = (io) => {
	io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join_game", (gameId) => {
            console.log(`User ${socket.id} joined game ${gameId}`);
            socket.join(gameId);

            io.to(gameId).emit('user_joined');
        });

        socket.on("set_username", (username) => {
            console.log(`User ${socket.id} set username: ${username}`);
            socket.username = username;

            io.to(socket.id).emit('username_set', { username });
        });
    });
};