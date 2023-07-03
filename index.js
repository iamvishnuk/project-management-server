const express = require("express")
const mongoose = require("./config/mongo")
const cors = require("cors")
const { createServer } = require("http")
const userRoutes = require("./Routes/user_routes")
const app = express()
const httpServer = createServer(app);
const { Server } = require("socket.io")

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}))

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    }
})

io.on("connection", (socket) => {
    // for chating
    socket.on("join-room", room => {
        socket.join(room)
    })
    socket.on("send-message", (message) => {
        io.to(message.team).emit("receved-msg", message)
    })

    // VIDEO CALL 1 TO 1 ONLY   
    // Triggered when a peer hits the join room button.
    socket.on("join", (roomName) => {
        const { rooms } = io.sockets.adapter
        const room = rooms.get(roomName)
        // room = undefined when so such room exists
        if (room === undefined) {
            socket.join(roomName)
            socket.emit("created")
        } else if (room.size === 1) {
            // room.size === 1 when one person is inside teh room
            socket.join(roomName);
            socket.emit("joined")
        } else {
            // wheere there are already two people insider the room
            socket.emit("full")
        }
    });

    // Triggered when the person who joined the room is ready to communicate.
    socket.on("ready", (roomName) => {
        socket.broadcast.to(roomName).emit("ready") // Infrom the other peer in the room
    });

    // Triggered when server gets an icecandidate from a peer in the room.
    socket.on("ice-candidate", (candidate, roomName) => {
        socket.broadcast.to(roomName).emit("ice-candidate", candidate) // send the candidate to the other peer in the room
    });

    // Triggered when server gets an offer from a peer in the room.
    socket.on("offer", (offer, roomName) => {
        socket.broadcast.to(roomName).emit("offer", offer) // sends Offer to the other peer in the room
    });

    // Triggered when server gets an answer from a peer in the room
    socket.on("answer", (answer, roomName) => {
        socket.broadcast.to(roomName).emit("answer", answer) // Send the answer to the other peer in the room.
    });

    // when the peer leave the room
    socket.on("leave", (roomName) => {
        socket.leave(roomName);
        socket.broadcast.to(roomName).emit("leave")
    });

})

app.use(express.json())
app.use("/", userRoutes)


httpServer.listen(4000, () => {
    console.log('server is running of port 4000')
})



