// const { generateMessages, getMessages, updateSeenMessages, createMessage } = require("../socketio/messages");
// const {
//     createNewRoom,
//     MarkRoomRead,
//     getRoomDetails,
//     getUserRooms,
//     isRoomExist,
//     getRoomDetailsForUser
// } = require("../socketio/rooms");
// const {
//     addUser,
//     removeUser,
//     getUser,
//     getUsersInRoom,
//     allUsers,
//     online,
// } = require("../socketio/users");


class WebSockets {
    async connection(socket) {
        console.log("Connected to the socket", socket);

        // /**
        // * @description - This socket function is used for join all rooms 
        // */

        // socket.on("join", async () => {
        //     console.log("Inside the socket join");

        //     const { onlineStatus } = await online({ userId: socket.userId, role: socket.userRole });

        //     socket.join(socket.userId)

        //     const { rooms } = await getUserRooms({ userId: socket.userId });

        //     console.log(rooms)


        //     rooms.forEach(room => {
        //         if (room._id) {
        //             socket.join(room._id.toString());
        //         }
        //         console.log(`${room._id} room joined`)
        //     });
        //     // rooms.map((room) => {
        //     //     if (room._id) {
        //     //         socket.join(room._id.toString());
        //     //         console.log(`${room._id} map`)

        //     //     }
        //     //     console.log(`${room._id} room joined`)
        //     // });
        // })


        // /**
        // * @description - This socket function is used for send new message 
        // */

        // socket.on('sendMessage', async (data) => {

        //     const { receiverId, receiverRole, messageContent, type ,roomId } = data // socket all params from client side


        //     // {
        //     //      "messageContent":"hello hi",
        //     //      "receiverId":"61fbb4e4328236babc35dbfb",
        //     //      "type":"text",
        //     //      "receiverRole":"tutor"
        //     //      "roomId":"6321b39d1b847f9b7b2bd130"
        //     //  }

        //     const saveObject = {
        //         id: socket.id,
        //         userId: socket.userId,
        //         role: socket.userRole,
        //         room :roomId,
        //     };

        //     const { user } = await addUser(saveObject);
        //     const { message } = await createMessage({
        //         messageContent, type, sender: socket.userId, receiverId, roomId, senderRole: socket.userRole, receiverRole
        //     });
        //     io.to(message.room.toString()).emit("receivedMessage", { message });
        // })


        // socket.on("refreshRooms", async () => {
        //     const { error, rooms } = await getRoomDetailsForUser({ userId: socket.userId });
        //     if (error) return;
        //     console.log("all romm", rooms, socket.id)
        //     io.to(socket.id).emit("allRooms", {
        //         allRooms: rooms
        //     });
        // })

        // socket.on('enterARoom', async ({
        //     room = ""
        // }) => {
        //     const saveObject = {
        //         id: socket.id,
        //         userId: socket.userId,
        //         role: socket.userRole,
        //         room,
        //     };
        //     socket.join(room)
        //     const { user } = await addUser(saveObject);
        //     console.log(`${socket.userId} user joined`, user);
        //     await updateSeenMessages({ room, userId: socket.userId, role: socket.userRole });
        //     const messages = await getMessages({ room, userId: socket.userId });
        //     io.to(socket.id).emit("allmessages", { messages: messages });
        //     // socket.emit("roomIsUpdated",{
        //     //     isRoomUpdated: true,
        //     //     room: room,
        //     // })
        // })

        // socket.on('getMessage', async ({
        //     room = "", page = 1
        // }) => {
        //     const messages = await getMessages({ room, page, userId: socket.userId });
        //     io.to(socket.id).emit("allmessages", { messages: messages });
        // })

        // socket.on("startTyping", async ({ room }) => {
        //     // console.log("starttyping",room)
        //     socket.to(room.toString()).emit("isTyping", { isTyping: true });
        //     // socket.broadcast.to(room).emit('isTyping', { isTyping: true });
        // })

        // socket.on("stopTyping", async ({ room }) => {
        //     socket.to(room.toString()).emit("isTyping", { isTyping: false });
        // })

        // socket.on("roomSeen", async ({ room = "" }) => {
        //     // await updateSeenMessages({ room, userId: socket.userId,role:socket.userRole });
        //     io.sockets.emit("roomIsUpdated", {
        //         isRoomUpdated: true,
        //         room: room,
        //     });
        // })

        // socket.on("getRoom", async ({ room = "" }) => {
        //     const { error, roomData } = await getRoomDetails({ roomId: room });
        //     io.to(socket.id).emit("roomInfo", {
        //         room: roomData,
        //     });
        // })

        // socket.on("exitRoom", ({ room = "" }) => {
        //     const user = removeUser(socket.id, room);
        // });

        // socket.on("disconnect", () => {
        //     console.log("user disconnected")
        //     const user = removeUser(socket.id);
        // });
    }
}

module.exports = new WebSockets();