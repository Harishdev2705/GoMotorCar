const Message = require("../models/message.model");
const { ObjectId } = require("mongoose").Types;
const Room = require("../models/room.model");
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    allUsers,
} = require("./users");


const generateMessages = (text) => {
    console.log({ text, createdAt: new Date() });
    return {
        text,
        createdAt: new Date(),
    };
};

const createMessage = async ({
    messageContent, type, sender, receiverId, roomId, senderRole, receiverRole
}) => {
    try {
        var messageObject = {}
        if (senderRole == "seller" && receiverRole == "admin") {
            messageObject = {
                message: messageContent,
                type: type ? type : "text",
                seller: sender,
                admin: receiverId,
                roles: {
                    sender: senderRole,
                    recevier: receiverRole
                },
                room: roomId,
                sendTime: new Date(),
            };

        } else if (senderRole == "admin" && receiverRole == "seller") {
            messageObject = {
                message: messageContent,
                type: type ? type : "text",
                seller: receiverId,
                admin: sender,
                roles: {
                    sender: senderRole,
                    recevier: receiverRole
                },
                room: roomId,
                sendTime: new Date(),
            };

        }

        let message = await new Message(messageObject);
        await message.save();



        // Update the last message in the room
        const query = {
            _id: ObjectId(message.room),
        };
        let roomData = await Room.findOne(query)

        let update;
        let isReceiverAvailable = await getUser({ userId: receiverId, room: roomId })
        const clients = io.sockets.adapter.rooms.get(roomId);

        const numClients = clients ? clients.size : 0;

        if (isReceiverAvailable.length == 1 && numClients == 2) {
            update = {
                $set: {
                    lastMessageId: message._id,
                    lastMessage: message.message,
                    lastMessageType: message.type
                }
            };
            message.isSeen = true
            await message.save()

        }
        else {
            update = (senderRole == "admin") ? {
                $set: {
                    lastMessageId: message._id,
                    lastMessage: message.message,
                    lastMessageType: message.type,
                    sellerUnseenCount: roomData.sellerUnseenCount + 1
                }
            } : {
                $set: {
                    lastMessageId: message._id,
                    lastMessage: message.message,
                    lastMessageType: message.type,
                    adminUnseenCount: roomData.adminUnseenCount + 1
                }
            }
        }
        await Room.updateOne(query, update);
        let newMessage = await Message.findById(message._id)
            .populate({ path: "seller", select: "name profilePic" })
            .populate({ path: "admin", select: "name profilePic" })
        return { error: false, message: newMessage };
    } catch (error) {
        return { error: error ? error : true };
    }
};

const markMessageRead = async ({ messageId, userId }) => {
    try {
        const searchCriteria = { _id: ObjectId(messageId) };
        const updateObject = {
            isSeen: true,
            $addToSet: {
                readBy: ObjectId(userId),
            },
        };
        const message = await Message.updateOne(searchCriteria, updateObject);
        return { error: null, message, messageId };
    } catch (error) {
        return { error: true };
    }
};

const getMessages = async ({ room, page, userId }) => {
    try {
        const query = { room: ObjectId(room) };
        const pageNo = parseInt(page) || 1
        const limit = 50
        const startIndex = (pageNo - 1) * limit
        const messages = await Message.find(query)
            .populate({ path: "seller", select: "name profileImage" })
            .populate({ path: "admin", select: "name profileImage" })
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit)
        const totalMessage = await Message.countDocuments(query)
        return { error: false, totalMessage, messages };
    } catch (error) {
        console.log({ error });
        return { error: true, messages: [] };
    }
};

const updateSeenMessages = async ({ room, userId, role }) => {
    try {
        const query = {
            _id: ObjectId(room)
        };
        let update;
        if (role == "admin") {
            update = { $set: { adminUnseenCount: 0 } };
        }
        else {
            update = { $set: { sellerUnseenCount: 0 } };
        }
        await Room.updateOne(query, update);
        const condition = { room: ObjectId(room)};
        await Message.updateMany(condition, { isSeen: true });
        return { error: false };
    } catch (error) {
        console.log({ error });
        return { error: true, messages: [] };
    }
};

module.exports = {
    generateMessages,
    markMessageRead,
    createMessage,
    getMessages,
    updateSeenMessages
};