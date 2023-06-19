const mongoose = require("mongoose")

const boardData = new mongoose.Schema({
    boardName: {
        type: String,
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project"
    },
    task: [
        {
            taskType:{
                type: String,
                required: true
            },
            shortSummary: {
                type: String,
                required: true
            },
            description: {
                type: String
            },
            assignee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            priority: {
                type: String,
                required: true
            },
            taskId: {
                type: Number,
                required: true,
            }
        }
    ]
})

module.exports = mongoose.model("board",boardData)