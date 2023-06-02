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
    }
})

module.exports = mongoose.model("user", userData)