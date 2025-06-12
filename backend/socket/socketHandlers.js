

export const setupSocketHandlers = (io) => {
	io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join_game", (code) => {
            console.log(`User ${socket.id} joined game ${code}`);
            socket.join(code);

            io.to(code).emit('user_joined');
        });

        socket.on("set_username", (username) => {
            console.log(`User ${socket.id} set username: ${username}`);
            socket.username = username;

            io.to(socket.id).emit('username_set', { username });
        });
    });
};