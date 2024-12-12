let io;

const initializeWebSocket = (httpServer) => {
  io = require("socket.io")(httpServer);
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!!");
  }
  return io;
};

module.exports = {
  initializeWebSocket,
  getIO,
};
