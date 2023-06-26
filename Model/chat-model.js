const mongoose = require("mongoose")

const chatData = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "team"
    }
})

module.exports = mongoose.model("chat", chatData)