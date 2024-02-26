const { isValidObjectId } = require("mongoose");
// const Ambassador = require("../models/ambassador.model");
// const Tutor = require("../models/tutor.model");
// const User = require("../models/user.model");
const { ObjectId } = require("mongoose").Types;



const allUsers = [];

const online = async ({ userId, role }) => {
    if (role == 'ambassador') {
        var updateStatus = await Ambassador.updateOne({
            _id: ObjectId(userId),
        }, {
            onlineStatus: {
                isOnline: true,
                onlineAt: new Date(), // current time
            },
        })
    } else if (role == 'tutor') {
        var updateStatus = await Tutor.updateOne({
            _id: userId,
        }, {
            onlineStatus: {
                isOnline: true,
                onlineAt: new Date(), // current time
            },
        })

    } else if (role == 'student') {

        var updateStatus = await User.updateOne({
            _id: userId,
        }, {
            onlineStatus: {
                isOnline: true,
                onlineAt: new Date(), // current time
            },
        })
    }
    return {onlineStatus: true }

};


const addUser = async ({
    id,
    userId,
    role,
    room,
}) => {
    //
    // console.log({ id, userId, role, room });
    room = room.trim().toLowerCase();
    const existingUser = allUsers.find(
        (user) => user.userId === userId && user.room === room
    );
    // console.log("exist user", existingUser);
    const user = { id, userId, role, room };
    if (!existingUser) {
        allUsers.push(user);
    }
    // console.log("allactive user",allUsers);
    return { user };
};

const removeUser = (id, room) => {
    const index = allUsers.findIndex(
        (user) => user.id === id && user.room === room
    );
    if (index !== -1) {
        return allUsers.splice(index, 1)[0];
    }
    // console.log("current user",allUsers)
};

const getUser = ({ userId, room }) => {
    // console.log("users",allUsers)
    // allUsers.filter((user) => user.userId === userId);
    return allUsers.filter((user) => user.userId === userId && user.room === room);
};

const getUsersInRoom = (room) => {
    return allUsers.filter((user) => user.room === room);
};

module.exports = { online, addUser, removeUser, getUser, getUsersInRoom, allUsers };