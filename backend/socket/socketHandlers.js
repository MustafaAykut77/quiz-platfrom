export const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    
    // Hata durumlarını ele al
    socket.on("error", (error) => {
      console.error(`Socket ${socket.id} error:`, error);
    });
    
    // Bağlantı koptuğunda temizlik yap
    socket.on("disconnect", (reason) => {
      console.log(`Socket ${socket.id} disconnected. Reason: ${reason}`);
    });
    
    // Kod alma olayını dinle
    socket.on("send-code", (code) => {
      console.log(`Received code from ${socket.id}:`, code);
      // Yanıt gönder (aynı socket'e)
      socket.emit("receive-code", code);
      // veya tüm istemcilere yanıt göndermek için:
      // io.emit("receive-code", code);
    });
  });
};