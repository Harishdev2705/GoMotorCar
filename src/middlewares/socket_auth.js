// const User = require("../models/user.model");
const { jwtSecret } = require("../utility/config");
const jwt = require("jsonwebtoken");
const { Unauthorized } = require("../utility/apiError");

const implementAuthChecks = (user, token) => {
    if (!user) {
        throw new Unauthorized("No user found");
    }
    if (user.token !== token) {
        throw new Unauthorized("you have exceeded the maximum number of active device");
    }
    if (user.isBlocked) {
        throw new Unauthorized("User account is blocked Please contact the admin");
    }
};

const implementDecodedTokenChecks = (decode) => {
    if (!decode) {
        throw new Unauthorized("Authentication Failure");
    }
    console.log("role", decode)
    if (decode && decode.role !== "" && decode.role !== "seller" && decode.role !== "buyer" && decode.role !== "admin") {
        throw new Unauthorized("Unauthenticated user role");
    }
};


const socketAuth = async (socket, next) => {
    // try{
    let token = "";

    if (socket.handshake.query && socket.handshake.query.token) {
        token = socket.handshake.query.token;
        let decoded = null;
        let user = null;
        decoded = jwt.verify(token, jwtSecret);
        if (!decoded) throw new Unauthorized("Token Invalid");
        socket.decoded = decoded;
        socket.userId = decoded._id;
        socket.userRole = decoded.role;

        console.log(socket.userRole,"<<<<<<<<<socket.userRole")
        
        next();
    } else {
        next(new Error("Authentication error"));
    }
};

module.exports = { socketAuth }