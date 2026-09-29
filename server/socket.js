const { Server } = require('socket.io');

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://69a7c7927067ee7a6fe117ee--Vellumtradeplatform.netlify.app',
        'https://69a8163c924800aded1627--Vellumtradeplatform.netlify.app',
        'https://www.vellumtrade.com',
        'https://vellumtrade.com'
      ],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // User joins their personal room
    socket.on('join_chat', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their chat room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };