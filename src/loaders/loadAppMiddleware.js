const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const { GeneralError, NotFound } = require("../utility/apiError");
const handleErrors = require("../middlewares/handleErrors");
const { env } = require("../utility/config");
const publicDirectoryPath = path.join(__dirname, "../../public");

const corsOption = {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token"],
};

/** @description - create a write stream (in append mode) */

let accessLogStream = fs.createWriteStream(
    path.join(__dirname, "../../logs/access.log"),
    { flags: "a" }
);

/**
 * @description - This function is used to initialise the request parser middlewares on initital run
 * @param {import("express").Application} app
 * @param {Express} express - The express import
 */

const initRequestParserMiddlewares = ({ app, express }) => {
    //corsOption
    app.use(cors(corsOption));

    app.use(
        express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
    );

    app.use(
        bodyParser.json({
            verify: (req, res, buf) => {
                req.rawBody = buf;
            },
            limit: "50mb",
        })
    );

    app.use(express.json());
};

/**
 * @description - This function is used to initialise the middlewares on initital run
 * @param {import("express").Application} app
 * @param {Express} express
 */
const initMiddlewares = ({ app, express }) => {

    app.set("view engine", "ejs");

    app.use("/static", express.static(publicDirectoryPath));

    app.use(morgan("combined", { stream: accessLogStream }));

    /** @description - catch 404 and forward to error handler */
    app.use((req, res, next) => {
        next(new NotFound("Not found error"));
    });

    app.use((err, req, res, next) => {
        logger.error("error", err);
        if (err instanceof GeneralError) {
            next(err);
            return;
        } else {
            if (env === "development") {
                return res.status(500).send(err.message);
            }
        }
        next(err);
    });

    /** @description - Middleware to handle the Errors */
    app.use(handleErrors);
};

module.exports = { initMiddlewares, initRequestParserMiddlewares };