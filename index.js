const express = require("express")
const mongoose = require("./config/mongo")
const cors = require("cors")
const userRoutes = require("./Routes/user_routes")
const app = express()

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}))


app.listen(4000, () => {
    console.log('server is running of port 4000')
})

app.use(express.json())
app.use("/", userRoutes)