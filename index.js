const express = require("express")
const mongoose = require("./config/mongo")
const cors = require("cors")
const { createServer } = require("http")
const userRoutes = require("./Routes/user_routes")
const app = express()
const httpServer = createServer(app);

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}))

app.use(express.json())
app.use("/", userRoutes)


httpServer.listen(4000, () => {
    console.log('server is running of port 4000')
})



