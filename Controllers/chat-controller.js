const Chat = require("../Model/chat-model")


module.exports.addChat = async (req, res) => {
    try {

        const { message, teamId } = req.body
        const userId = req.userId
        const messageObj = {
            message: message,
            from: userId,
            team: teamId
        }
        let data = await Chat.create(messageObj)
        data = await data.populate("from")
        res.status(200).json({ data, message: "message added successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports.getAllMessage = async (req, res) => {
    try {
        const teamId = req.params.teamId
        const data = await Chat.find({ team: teamId }).populate("from")
        res.status(200).json({ message: data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}