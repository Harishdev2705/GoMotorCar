const express = require("express");
const app = express();
const loadAppRoutes = require("./src/loaders/loadAppRoutes");
const loadAppMiddlewares = require("./src/loaders/loadAppMiddleware");
const loadDatabase = require("./src/loaders/loadDatabase");
const loadSocketServer = require("./src/loaders/load_socket_server");
const path = require('path');

const http = require('http')
const server = http.createServer(app);


/** @description Iniitialise the logger middleware and assign it to global logger variable */
global.logger = require("./logger"); 
var cors = require('cors')
app.use(cors())
/*** @description - This is to handle all the unhandled rejections so as to prevent fatal crash in case of unhandled rejection */

app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static('images'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

process.on("unhandledRejection", (error) => {
    console.error("Uncaught Error", { error: error.message });
    logger.error("error", error);
});

const socketio = require("socket.io")(server, {
    cors: {
        origin: true,
        methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

/** @description - This function is used to intitialise all the important components of the App at  the initial run of the app like  routes points , init middlewares*/

(function () {

    /** @description App socket connection  */

    loadSocketServer.connectSocketServer({ socketio, server });

    /** @description App request parser Initialisation */

    loadAppMiddlewares.initRequestParserMiddlewares({ app, express });

    /** @description App routes Iniitialisation */

    loadAppRoutes.initRoutes({ app });

    /**  @description  App middlewares Initialisation*/

    loadAppMiddlewares.initMiddlewares({ app, express });

    /**  @description   Database Initialisation  */
    loadDatabase.initDatabase();
})();

module.exports = server;