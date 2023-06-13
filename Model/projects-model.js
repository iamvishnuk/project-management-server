const mongoose = require("mongoose")

const projectData = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    projectCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    projectUrl: {
        type: String,
        required: true
    },
    projectLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }]
})

module.exports = mongoose.model("project", projectData)