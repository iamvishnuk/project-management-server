const mongoose = require('mongoose')

const teamData = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    message: [{
        text: {
            type: String,
            required: true
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    }]
})

module.exports = mongoose.model("team", teamData)