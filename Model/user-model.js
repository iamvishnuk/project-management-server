const mongoose = require("mongoose")

const userData = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    publicId: {
        type: String
    },
    your_job_title: {
        type: String
    },
    your_orgainzation: {
        type: String
    },
    project: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "project"
    }],
    verified: {
        type: Boolean,
        default: false
    },
    member: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    notification: [{
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        },
        readed: {
            type: Boolean,
            default: false
        }
    }]
})

module.exports = mongoose.model("user", userData)