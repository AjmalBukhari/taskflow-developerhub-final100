let io;
const { Server } = require('socket.io');
const config = require('../config/config');

const noop = { emit() {} };
const safeIo = {
  to() { return noop; },
  emit() {}
};

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: { origin: config.corsOrigin, methods: ["GET", "POST"] }
    });
    return io;
  },
  getIO: () => {
    return io || safeIo;
  }
};
