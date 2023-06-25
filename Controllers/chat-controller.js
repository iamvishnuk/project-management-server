const Team = require("../Model/team-model")


module.exports.addChat = async (req, res) => {
    try {

        const { message, teamId } = req.body
        const userId = req.userId
        const messageObj = {
            text: message,
            from: userId
        }
        await Team.updateOne(
            { _id: teamId },
            {
                $push: {
                    message: messageObj
                }
            }
        )
        res.status(200).json({ message: "message added successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports.getAllMessage = async (req, res) => {
    try {
        const teamId = req.params.teamId
        const data = await Team.findOne({ _id: teamId }).populate("message.from")
        res.status(200).json({ message: data.message })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}