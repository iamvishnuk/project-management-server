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
    console.log("socket is connection established")
    // for chating
    socket.on("join-room", room => {
        socket.join(room)
    })
    socket.on("send-message", (message) => {
        io.to(message.team).emit("receved-msg", message)
    })
    // for video calling 1st
    socket.on("join-video-room", roomId => {
        io.to(roomId).emit("user:joined", { id: socket.id })
        socket.join(roomId)
        io.to(socket.id).emit("video-room", roomId)
    })

    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer })
    })

    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans })
    })

    socket.on("peer:negotiationneeded", ({ to, offer }) => {
        io.to(to).emit("peer:negotiationneeded", { from: socket.id, offer })
    })

    socket.on("peer:nego:done", ({ to, ans }) => {
        io.to(to).emit("peer:nego:final", { from: socket.id, ans })
    })

    // videCalling 2
    socket.on("join:room", roomId => {
        console.log("join:room")
        socket.to(roomId).emit("new:user:joined")
    })
    // send offer to callee
    socket.on("send:offer", (offer, roomId) => {
        console.log("send:offer")
        socket.to(roomId).emit("receive:offer", offer)
    })
    // answer
    socket.on("answer:created", (ans, roomId) => {
        console.log("answer:created")
        socket.to(roomId).emit("receive:answer", ans)
    })
    // on ice candidate
    socket.on("ice:candidate", (iceCandidate, roomId) => {
        console.log("ice: candidate")
        socket.to(roomId).emit("receive:iceCandidate", iceCandidate)
    })
})

app.use(express.json())
app.use("/", userRoutes)


httpServer.listen(4000, () => {
    console.log('server is running of port 4000')
})



