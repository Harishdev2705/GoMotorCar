const WebSockets = require("../utils/webSocket");
const { socketAuth } = require("../middlewares/socket_auth");

/**
 * @description - This function is used to initialise the middlewares on initital run
 * @param {import("express").Application} app
 * @param {Express} express
 */

const connectSocketServer = ({ socketio, server }) => {
  console.log("inside socket setup")
  // var io = socketio.listen(server)
  global.io = socketio;
  global.io.use(socketAuth);
  global.io.on("connection", WebSockets.connection);
};

module.exports = { connectSocketServer };
