const { ObjectId } = require("mongoose").Types;
const Message = require("../models/message.model");
const Room = require("../models/room.model");


const isRoomExist = async ({ sender, senderRole, receiverId, receiverRole, socket }) => {
    var query = {}
    if (senderRole == "student") {
        query = {
            tutor: receiverId,
            student: sender,
        };
    } else {
        query = {
            tutor: sender,
            student: receiverId,
            role: {
                sender: senderRole,
                recevier: receiverRole
            }
        };
    }
    
    var room = await Room.findOne(query);
    return { roomId: room._id.toString() }

}

// const isRoomExist = async ({ business = "", user = "" }) => {
//     const query = {
//         business: business,
//         user: user,
//     };
//     const update = {};
//     console.log({ query })
//     let room = await Room.findOne(query, update);
//     if (room) {
//         room.isRoomActive = true
//         await room.save();
//     }
//     return room

// }

const findRoomByParticipants = async ({ business = "", user = "" }) => {
    const query = {
        business: business, user: user
    };
    const update = {};
    const room = await Room.findOne(query, update);
    return { error: null, room };
}

const createNewRoom = async ({ supportTicketId, sellerId, lastMessage,adminId }) => {
    try {
        const roomObject = {
            supportTicketId: supportTicketId,
            admin: adminId,
            seller: sellerId,
            adminUnseenCount: 0,
            roles: {
                sender: "seller",
                recevier: "admin"
            },
            lastMessage: lastMessage,
            isRoomActive: true
        };

        const room = await new Room(roomObject);
        await room.save();

        return {room}
    } catch (error) {
        return { error };
    }
};

const createNewRoomApi = async (req, res) => {
    const { sender, receiver } = req.body;
    try {
        const roomExists = await findRoomByUserid({ sender, receiver });
        console.log({ roomExists });
        if (roomExists) {
            return res
                .status(400)
                .send({ success: false, message: "Room already exists" });
        }
        const roomObject = {
            // sender,
            // receiver,
            chatInitiator: ObjectId(sender),
            isRoomActive: true,
            user: req.user._id,
            adminUser: ObjectId(receiver),
            time: new Date(),
        };
        const room = await new Room(roomObject);
        room.participants.addToSet(sender);
        room.participants.addToSet(receiver);

        await room.save();
        return res.status(200).send({
            error: null,
            room,
            roomId: room._id,
            message: "Room Created successfully",
            success: true,
        });

    } catch (error) {
        logger.error("error", error);
        console.log({ error });
        return res.status(400).send({
            success: false,
            messages: "Failure in creating the room",
            error,
        });
    }
};

const getRoomMessages = async ({ skip, limit, roomId }) => {
    try {
        const searchCriteria = { room: ObjectId(roomId) };
        const messages = await Message.find(searchCriteria).skip(skip).limit(limit);

        return { error: null, messages };
    } catch (error) {
        return { error };
    }
};

const getRoomDetails = async ({ roomId }) => {
    try {
        const searchCriteria = { _id: ObjectId(roomId) };
        const room = await Room.findOne(searchCriteria)
            .populate({ path: "business", select: "firstName lastName fullName profileImage" })
            .populate({ path: "user", select: "firstName lastName fullName profileImage" })
            .populate({ path: "lastMessageId", select: "message createdAt" })
        return { error: null, roomData: room };
    } catch (error) {
        return { error };
    }
};

// MarkRoomRead

const MarkRoomRead = async ({ userId, room }) => {
    try {
        const searchCriteria = {
            receiver: ObjectId(userId),
            roomId: ObjectId(room),
        };
        const updateObject = {
            isSeenByReceiver: true,
            $addToSet: {
                readBy: ObjectId(userId),
            },
        };
        await Message.updateMany(searchCriteria, updateObject);

        return { error: null, roomdata: room, roomId: room._id };
    } catch (error) {
        return { error };
    }
};

const getUserRoomDetails = async (req, res) => {
    try {
        logger.info("Inside the get user room details");
        const searchCriteria = {
            participants: {
                $in: [ObjectId(req.user._id)],
            },
        };
        const room = await Room.findOne(searchCriteria);
        if (!room) {
            return res
                .status(200)
                .send({ success: false, room, message: "No room found" });
        }

        return res
            .status(200)
            .send({ success: true, room, message: "Room found successfully" });
    } catch (error) {
        logger.error("error", error);
        console.log({ error });
        return res.status(400).send({
            success: false,
            messages: "Failure in getting the user room data",
            error,
        });
    }
};



const getUserRooms = async ({ userId }) => {
    try {
        let condition = { student: userId }
        const rooms = await Room.find(condition)

        return { rooms, error: null };
    } catch (error) {
        console.log(error);
        return { error: error ? error : true, rooms: [] };
    }
};


// const getRoomDetailsOfAOrder = async ({ order }) => {
//     try {

//         const condition = { _id: ObjectId(order), isDeleted: { $ne: true } };
//         let projection = { requestList: 1, _id: 0 };
//         var order = await Order.findOne(condition, projection)
//             .populate({
//                 path: "requestList",
//                 select: "traveler room",
//                 populate: {
//                     path: 'traveler',
//                     select: "fullName profilePicture -_id",
//                 },
//                 populate: {
//                     path: 'room',
//                     select: "participants updatedAt",
//                     populate: {
//                         path: 'lastMessageId',
//                         select: "message sendTime",
//                     },
//                 }
//                 //  "product.isDeliveryLocked" : {$ne: false}
//                 // match: { isDeliveryLocked: {$ne: false}}

//             })
//         return { rooms, error: null };
//     } catch (error) {
//         console.log(error);
//         return { error: error ? error : true, rooms: [] };
//     }
// };



// const getLatestOrderOfARoom = async ({ userId, room }) => {
//     try {

//         const condition = {
//             room: ObjectId(room), isDeleted: { $ne: true },
//             status: { $in: ["requestedbytraveler", "accepted", "paid", "picked", "delivered"] }
//         };
//         let projection = { order: 1, _id: 0 };
//         const order = await DeliveryRequest.findOne(condition, projection)
//             .sort({ createdAt: -1 })

//         return { orderId: order._id, error: null };
//     } catch (error) {
//         console.log(error);
//         return { error: error ? error : true, rooms: [] };
//     }
// };
const getRoomDetailsForUser = async ({ userId }) => {
    try {
        let condition = { $and: [{ $or: [{ 'seller': userId }, { 'admin': userId }] }, { 'isRoomActive': true }] }
        // const projection = {participants:0}
        const rooms = await Room.find(condition)
        .populate({ path: "seller", select:"name profileImage"})
        .populate({ path: "admin", select: "name profileImage" })
            .populate({ path: "lastMessageId", select: "message createdAt"})
            .sort({updatedAt: -1})
        return { rooms, error: null };
    } catch (error) {
        console.log(error);
        return { error: error ? error : true, rooms: [] };
    }
};

module.exports = {
    isRoomExist,
    findRoomByParticipants,
    createNewRoom,
    getRoomDetails,
    MarkRoomRead,
    getRoomMessages,
    getUserRoomDetails,
    createNewRoomApi,
    getUserRooms,
    getRoomDetailsForUser,
};